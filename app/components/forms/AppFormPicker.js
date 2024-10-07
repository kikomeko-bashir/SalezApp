import React from "react";
import { useFormikContext } from "formik";

import AppPicker from "../AppPicker";
import ErrorMessage from "./ErrorMessages";

function AppFormPicker({ name, items, PickerItemcomponet, numberOfColums, placeholder }) {
    const { errors, setFieldValue, touched, values } = useFormikContext();

    return (
        <>
            <AppPicker
                items={items}
                numberOfColumns={numberOfColums}
                onSelectItem={(item) => setFieldValue(name, item)}
                PickerItemComponent={PickerItemcomponet}
                placeholder={placeholder}
                selectedItem={values[name]}  
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />  
        </>
    );
}

export default AppFormPicker;
