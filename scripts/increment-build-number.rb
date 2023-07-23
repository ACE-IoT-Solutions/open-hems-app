#!/bin/ruby
#
# Increment build numbers.
# Bump Android version code by 1: eg 27 -> 28
# Bump semver version patch level by 1: eg 0.1.8 -> 0.1.9

# version_number = `cat android/app/build.gradle | grep -E "versionCode ([0-9]+)"`
#   .sub(/versionCode\s+/, '')
#   .to_i
version_number = `cat app.json | jq '.expo.android.versionCode'`.gsub('"','').strip.to_i
version_name = `cat package.json | jq '.version'`.gsub('"','').strip

new_version_number = version_number + 1
new_version_name = begin
  p = version_name.split('.').map(&:to_i)
  p[2] = p[2] + 1
  p.join('.')
end

puts "Current: #{version_name} build #{version_number}"
puts "Updating to: #{new_version_name} build #{new_version_number}"

`ruby scripts/set-build-number.rb --versionName=#{new_version_name} --buildNumber=#{new_version_number}`
