import React from 'react';
import { useFormikContext } from 'formik';
import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessages';

function AppFormField({ name, ...otherProps }) {
    const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

    return (
        <>
            <AppTextInput
                onBlur={() => setFieldTouched(name)}  // Use the prop 'name'
                onChangeText={handleChange(name)}    // Use the prop 'name'
                {...otherProps}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    );
}

export default AppFormField;
