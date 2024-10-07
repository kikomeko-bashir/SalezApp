import React from "react";
import { useFormikContext } from "formik";
import AppPicker from "../AppPicker";
import ErrorMessage from "./ErrorMessages";

function AppFormPicker({ 
    name, 
    items, 
    PickerItemComponent,  // Corrected prop name
    numberOfColumns = 1,  // Default value set
    placeholder 
}) {
    const { errors, setFieldValue, touched, values } = useFormikContext();

    return (
        <>
            <AppPicker
                items={items}
                numberOfColumns={numberOfColumns}  // Corrected prop name
                onSelectItem={(item) => setFieldValue(name, item)}
                PickerItemComponent={PickerItemComponent}  // Corrected prop name
                placeholder={placeholder}
                selectedItem={values[name]}  
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />  
        </>
    );
}

export default AppFormPicker;
