import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Flex, Heading, Image, Link, Stack, Text, Spinner, Center} from "@chakra-ui/react";
import CreateCustomerForm from "../shared/CreateCustomerForm.jsx";
import Logo from "../../assets/Customer_Management_Portal_Logo.png";
import Picture from "../../assets/UT_Austin_Picture.png"

const Signup = () => {
    const { customer, loading, setCustomerFromToken } = useAuth();
    const navigate = useNavigate();

    // FIX: Add dependency array to prevent infinite re-renders
    useEffect(() => {
        if (!loading && customer) {
            navigate("/dashboard/customers");
        }
    }, [customer, loading, navigate]); // Add dependencies

    // Show loading spinner while checking authentication status
    if (loading) {
        return (
            <Center minH="100vh">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
        );
    }

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
                    <Heading fontSize={'2xl'} mb={15}>Register for an account</Heading>
                    <CreateCustomerForm onSuccess={(token) => {
                        console.log("Signup success, token received:", token); // Debug log

                        if (token) {
                            localStorage.setItem("access_token", token);
                        }

                        // Update customer from token
                        setCustomerFromToken();

                        // Navigate to dashboard
                        navigate("/dashboard");
                    }}/>
                    <Link color={"blue.500"} href={"/"}>
                        Have an account? Login now.
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

export default Signup;