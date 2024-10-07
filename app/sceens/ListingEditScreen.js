import React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem"
import { AppForm, AppFormField, AppFormPicker, SubmitButton } from "../components/forms";

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Title"),
    price: Yup.number().required().min(1).max(10000).label("Price"),
    description: Yup.string().label("Description"),
    category: Yup.object().required().nullable().label("Category"),
});

// Category options
const categories = [
    { label: "Furniture", value: 1, backgroundColor: 'red', Icon:'apps' },
    { label: "Electronics", value: 2, backgroundColor: 'green', Icon:'email' },
    { label: "Clothing", value: 3, backgroundColor: 'yellow', Icon:'lock' },
    { label: "Books", value: 4, backgroundColor: 'orange', Icon:'apps' },
];

const ListingEditScreen = () => (
    <Screen style={styles.container}>
        <AppForm
            initialValues={{
                title: "",
                price: "",
                description: "",
                category: null,
            }}
            onSubmit={(values) => console.log(values)}
            validationSchema={validationSchema}
        >
            <AppFormField
                name="title"
                placeholder="Title"
                maxLength={255}
            />
            <AppFormField
                name="price"
                placeholder="Price"
                keyboardType="numeric"
                maxLength={8}
            />
            <AppFormPicker
                name="category"
                numberOfColums={3}
                PickerItemcomponet={CategoryPickerItem}
                placeholder="Category"
                items={categories}
            />
            <AppFormField
                name="description"
                placeholder="Description"
                multiline
                numberOfLines={3}
                maxLength={255}
            />
            <SubmitButton title="Post" />
        </AppForm>
    </Screen>
);

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default ListingEditScreen;
