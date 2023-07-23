import { useEffect, useState } from "react";
import { getStorageMacAddress, getWelcomeDismissed, setWelcomeDismissed, getStorageMacAddressConfigured} from "../utils/api";
import { AppScreenParamsList } from "../types";

export function useMacAddressConfigured() {
    const [macAddressConfigured, setMacAddressConfigured] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function getMacAddressConfigured() {
        try {
            setError(false);
            setLoading(true);

            const macAddressConfigured = await getStorageMacAddressConfigured();
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!macAddressConfigured) {
            getMacAddressConfigured();
        }
    }, []);
    return { macAddressConfigured, error, loading, getMacAddressConfigured };
}

// export function useMacAddress() {
//     const [data, setData] = useState<>();
//     const [error, setError] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);

//     async function getData() {
//         try {
//             setError(false);
//             setLoading(true);

//             const macAddress = await getStorageMacAddress();
//             setData({ macAddress, welcomeDismissed });

//         } catch (error) {
//             setError(true);
//         } finally {
//             setLoading(false);
//         }
//     }
//     useEffect(() => {
//         if (!data) {
//             getData();
//         }
//     }, []);
//     return { data, error, loading, getData };
// }
export function useWelcomeDismissed() {
    const [welcomeDismissedState, setWelcomeDismissedState] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function getWelcomeDismissedState() {
        try {
            setError(false);
            setLoading(true);

            const welcomeDismissed = await getWelcomeDismissed();
            setWelcomeDismissedState(welcomeDismissed);

        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    async function setWelcomeDismissedEffect() {
        try {
            setError(false);
            setLoading(true);

            await setWelcomeDismissed(true);
            setWelcomeDismissedState(true);

        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!welcomeDismissedState) {
            getWelcomeDismissed();
        }
    }, []);
    return { welcomeDismissedState, error, loading, getWelcomeDismissedState, setWelcomeDismissedEffect};
}

export function useInitialRouteName() {
    const [initialRouteNameState, setInitialRouteNameState] = useState<keyof AppScreenParamsList>();
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function getInitialRouteName() {
        try {
            setError(false);
            setLoading(true);

            const initialRouteName = (await getWelcomeDismissed()) ? "AppNavigator" : "WelcomeScreen";
            console.log("getInitialRouteName", initialRouteName);

            setInitialRouteNameState(initialRouteName);

        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (!initialRouteNameState) {
            getInitialRouteName();
        }
    }, []);
    return { initialRouteNameState, error, loading, getInitialRouteName};
}