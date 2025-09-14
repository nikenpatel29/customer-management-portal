import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import {Alert, AlertIcon, Box, Button, FormLabel, Input, Select, Stack} from "@chakra-ui/react";
import {saveCustomer} from "../../services/client.js";
import {successNotification, errorNotification} from "../../services/notification.js";

const MyTextInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input className="text-input" {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

const MySelect = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Select {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert className="error" status={"error"} mt={2}>
                    <AlertIcon/>
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

const CreateCustomerForm = ({ onSuccess }) => {
    return (
        <Formik
            initialValues={{
                name: '',
                email: '',
                age: '', // FIX: Change from 0 to empty string
                gender: '',
                password: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .max(50, 'Must be 50 characters or less') // Increased limit
                    .required('Name is required'),
                email: Yup.string()
                    .email('Must be a valid email address') // Fixed validation message
                    .required('Email is required'),
                age: Yup.number()
                    .min(16, 'Must be at least 16 years of age')
                    .max(100, 'Must be less than 100 years of age')
                    .required('Age is required'), // Added required message
                password: Yup.string()
                    .min(4, 'Must be 4 characters or more')
                    .max(20, 'Must be 20 characters or less') // Increased limit
                    .required('Password is required'),
                gender: Yup.string()
                    .oneOf(
                        ['MALE', 'FEMALE'],
                        'Please select a valid gender'
                    )
                    .required('Gender is required'),
            })}
            onSubmit={async (customer, {setSubmitting, resetForm}) => {
                try {
                    setSubmitting(true);
                    console.log('Submitting customer:', customer); // Debug log

                    const res = await saveCustomer(customer);
                    console.log('Response received:', res); // Debug log

                    successNotification(
                        "Customer saved",
                        `${customer.name} was successfully saved`
                    );

                    // FIX: Check if onSuccess exists and handle token properly
                    if (onSuccess && res.headers && res.headers["authorization"]) {
                        onSuccess(res.headers["authorization"]);
                    } else if (onSuccess) {
                        // If no token in header, still call onSuccess
                        onSuccess();
                    }

                    resetForm(); // Reset form after successful submission
                } catch (err) {
                    console.error('Error saving customer:', err); // Debug log
                    errorNotification(
                        err.code || "Error",
                        err.response?.data?.message || "Failed to save customer"
                    );
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({isValid, isSubmitting, values}) => {
                // Debug log to see form state
                console.log('Form state:', { isValid, isSubmitting, values });

                return (
                    <Form>
                        <Stack spacing={"24px"}>
                            <MyTextInput
                                label="Full Name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                            />

                            <MyTextInput
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="your.email@example.com"
                            />

                            <MyTextInput
                                label="Age"
                                name="age"
                                type="number"
                                placeholder="Enter your age"
                                min="16"
                                max="100"
                            />

                            <MyTextInput
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Create a secure password"
                            />

                            <MySelect label="Gender" name="gender">
                                <option value="">Select your gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </MySelect>

                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                colorScheme="blue"
                                size="lg"
                                isLoading={isSubmitting}
                                loadingText="Creating Account..."
                            >
                                {isSubmitting ? "Creating Account..." : "Create Account"}
                            </Button>
                        </Stack>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default CreateCustomerForm;