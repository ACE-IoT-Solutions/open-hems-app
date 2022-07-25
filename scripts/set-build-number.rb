#!/bin/ruby
#
# Set build number strings for:
#   ios/OpenHEMS/Info.plist
#   android/app/build.gradle
#   app.json
#   package.json

require 'optparse'
require 'yaml'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: #{$0} --versionName M.m.p --androidVersionCode N"

  opts.on('-v', '--versionName VERSION_NAME', 'App version string') { |v| options[:version_name] = v }
  opts.on('-n', '--buildNumber BUILD_NUMBER', 'Apple build number + Android version code') { |v| options[:build_number] = v }
end.parse!

unless options[:version_name] && options[:build_number]
  puts "Usage: #{$0} -v M.m.p -n N"
  exit
end

version_name = options[:version_name]
android_version_code = options[:build_number]
apple_build_number = options[:build_number]
puts "🧙 Updating versions: versionName=#{version_name} androidVersionCode=#{android_version_code} appleBuildNumber=#{apple_build_number}"

# Rewrite Apple ids
#   version name (0.0.9)
#   build number (16)
ios_plist_path = 'ios/OpenHEMS/Info.plist'
ios_plist = File
  .read(ios_plist_path)
  .sub(/<key>CFBundleShortVersionString<\/key>\n    <string>([0-9.]+)<\/string>/, "<key>CFBundleShortVersionString</key>\n    <string>#{version_name}</string>")
  .sub(/<key>CFBundleVersion<\/key>\n    <string>([0-9]+)<\/string>/, "<key>CFBundleVersion</key>\n    <string>#{apple_build_number}</string>")
File.write(ios_plist_path, ios_plist)
puts "✨ Updated #{ios_plist_path}"

# Rewrite Gradle config
#   version name (0.0.9)
#   version code (16)
gradle_config_path = 'android/app/build.gradle'
gradle_config = `cat #{gradle_config_path} | sed -E -e 's/versionCode [0-9]+/versionCode #{android_version_code}/g' | sed -E -e 's/versionName "[0-9.]+"/versionName "#{version_name}"/g'`
File.write(gradle_config_path, gradle_config)
puts "✨ Updated #{gradle_config_path}"

# Rewrite app.json
app_json_path = 'app.json'
app_json = `cat #{app_json_path} | jq --arg versionName "#{version_name}" --arg versionCode "#{android_version_code}" '.expo.android.versionCode=$versionCode | .expo.version=$versionName'`
File.write(app_json_path, app_json)
puts "✨ Updated #{app_json_path}"

# Rewrite package.json
package_json_path = 'package.json'
package_json = `cat #{package_json_path} | jq --arg versionName "#{version_name}" '.version=$versionName'`
File.write(package_json_path, package_json)
puts "✨ Updated #{package_json_path}"

# Prettier up jq's mess
`yarn prettier --write app.json package.json`
