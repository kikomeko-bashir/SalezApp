import React from "react";
import { useFormikContext } from "formik";
import AppPicker from "../AppPicker";
import ErrorMessage from "./ErrorMessages"; // Ensure correct import

function AppFormPicker({ 
    name, 
    items, 
    PickerItemComponent, 
    numberOfColumns = 1, 
    placeholder 
}) {
    const { errors, setFieldValue, touched, values } = useFormikContext();

    return (
        <>
            <AppPicker
                items={items}
                numberOfColumns={numberOfColumns}
                onSelectItem={(item) => setFieldValue(name, item)} // Adjust based on form structure
                PickerItemComponent={PickerItemComponent} // Check if AppPicker expects ItemComponent
                placeholder={placeholder}
                selectedItem={values[name]} // Use this if storing full object
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />  
        </>
    );
}

export default AppFormPicker;
