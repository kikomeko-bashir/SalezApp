import { StyleSheet } from "react-native";
import * as Yup from "yup";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import { AppForm, AppFormField, AppFormPicker, SubmitButton } from "../components/forms";
import FormImagePicker from "../components/forms/FormImagePicker";
import useLocation from "../hooks/useLocation";

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Title"),
    price: Yup.number().required().min(1).max(10000).label("Price"),
    description: Yup.string().label("Description"),
    category: Yup.object().required().nullable().label("Category"),
    images: Yup.array().min(1, "Please select at least one image."),
});

// Category options
const categories = [
    { label: "Furniture", value: 1, backgroundColor: 'red', Icon: 'apps' },
    { label: "Electronics", value: 2, backgroundColor: 'green', Icon: 'email' },
    { label: "Clothing", value: 3, backgroundColor: 'yellow', Icon: 'lock' },
    { label: "Books", value: 4, backgroundColor: 'orange', Icon: 'apps' },
];

function ListingEditScreen() {
    const location = useLocation();
    return ( 
        <Screen style={styles.container}>
            <AppForm
                initialValues={{
                    title: "",
                    price: "",
                    description: "",
                    category: null,
                    images: [],
                }}
                onSubmit={(values) => console.log(location)}
                validationSchema={validationSchema}
            >
                <FormImagePicker name="images" />
                <AppFormField name="title" placeholder="Title" maxLength={255} />
                <AppFormField name="price" placeholder="Price" keyboardType="numeric" maxLength={8} />
                <AppFormPicker
                    name="category"
                    numberOfColumns={3} 
                    PickerItemComponent={CategoryPickerItem} // Correct prop name
                    placeholder="Category"
                    items={categories}
                />

                <AppFormField name="description" placeholder="Description" multiline numberOfLines={3} maxLength={255} />
                <SubmitButton title="Post" />
            </AppForm>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default ListingEditScreen; 
