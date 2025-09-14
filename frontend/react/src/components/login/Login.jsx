
// 1. Fixed Login Component
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormLabel,
    Heading,
    Image,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import {Formik, Form, useField} from "formik";
import * as Yup from 'yup';
import {useAuth} from "../context/AuthContext.jsx";
import {errorNotification} from "../../services/notification.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import Logo from "../../assets/Customer_Management_Portal_Logo.png";
import Picture from "../../assets/UT_Austin_Picture.png"

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

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    return (
        <Formik
            validateOnMount={true}
            validationSchema={
                Yup.object({
                    username: Yup.string()
                        .email("Must be valid email")
                        .required("Email is required"),
                    password: Yup.string()
                        .max(20, "Password cannot be more than 20 characters")
                        .required("Password is required")
                })
            }
            initialValues={{username: '', password: ''}}
            onSubmit={(values, {setSubmitting}) => {
                setSubmitting(true);
                login(values).then(res => {
                    navigate("/dashboard")
                    console.log("Successfully logged in");
                }).catch(err => {
                    errorNotification(
                        err.code,
                        err.response.data.message
                    )
                }).finally(() => {
                    setSubmitting(false);
                })
            }}>

            {({isValid, isSubmitting}) => (
                <Form>
                    <Stack mt={15} spacing={15}>
                        <MyTextInput
                            label={"Email"}
                            name={"username"}
                            type={"email"}
                            placeholder={"nikenpatel1229@gmail.com"}
                        />
                        <MyTextInput
                            label={"Password"}
                            name={"password"}
                            type={"password"}
                            placeholder={"Type your password"}
                        />

                        <Button
                            type={"submit"}
                            disabled={!isValid || isSubmitting}
                            colorScheme="blue"
                            size="lg"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    )
}

const Login = () => {
    const { customer } = useAuth();
    const navigate = useNavigate();

    // FIX: Add dependency array to prevent infinite re-renders
    useEffect(() => {
        if (customer) {
            navigate("/dashboard/customers");
        }
    }, [customer, navigate]); // Add dependencies here

    return (
        <Stack minH={'100vh'} direction={{base: 'column', md: 'row'}}>
            <Flex p={8} flex={1} alignItems={'center'} justifyContent={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Image
                        src={Logo}
                        boxSize={"200px"}
                        alt={"Logo"}
                        alignSelf={"center"}
                    />
                    <Heading fontSize={'2xl'} mb={15}>Sign in to your account</Heading>
                    <LoginForm/>
                    <Link color={"blue.500"} href={"/signup"}>
                        Don't have an account? Sign up now!
                    </Link>
                </Stack>
            </Flex>
            <Flex
                flex={1}
                p={10}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                bgGradient={{sm: 'linear(to-r, blue.600, purple.600)'}}
            >
                <Image
                    alt={'Login Image'}
                    objectFit={'scale-down'}
                    src={Picture}
                />
            </Flex>
        </Stack>
    );
}

// 2. Fixed Home Component (only showing the key fixes)
const Home = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate(); // Add this hook

    // ... other code stays the same ...

    // FIX: Add dependency array
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []); // Empty dependency array is correct here

    // ... rest of component stays the same but fix the navigation:

    return (
        <SidebarWithHeader>
            {/* ... existing code ... */}

            {/* FIX: Replace window.location.href with proper navigation */}
            <Box
                bg={cardBg}
                borderRadius="2xl"
                p={8}
                shadow="xl"
                border="1px"
                borderColor="green.200"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{
                    transform: "translateY(-8px)",
                    shadow: "2xl",
                    borderColor: "green.300"
                }}
                onClick={() => navigate("/dashboard/customers")} // Use navigate instead
                maxW="lg"
            >
                {/* ... rest of the box content ... */}
            </Box>

            {/* ... rest of component ... */}
        </SidebarWithHeader>
    );
};

export default Login;