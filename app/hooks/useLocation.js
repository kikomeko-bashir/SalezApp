import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useLocation = () => {
    const [location, setLocation] = useState(null);

    const getLocation = async () => {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync(); // 🛠️ Use foreground permissions
            if (!granted) return;

            const { coords } = await Location.getLastKnownPositionAsync();
            if (coords) {
                setLocation({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLocation();
    }, []); 

    return location;
};

export default useLocation; 
