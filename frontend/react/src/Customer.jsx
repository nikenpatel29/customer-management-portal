import {
    Wrap,
    WrapItem,
    Spinner,
    Text,
    Alert,
    AlertIcon,
    Button,
    VStack
} from '@chakra-ui/react';
import SidebarWithHeader from "./components/shared/SideBar.jsx";
import { useEffect, useState } from 'react';
import { getCustomers } from "./services/client.js";
import CardWithImage from "./components/customer/CustomerCard.jsx";
import CreateCustomerDrawer from "./components/customer/CreateCustomerDrawer.jsx";
import {errorNotification} from "./services/notification.js";

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setError] = useState("");

    const fetchCustomers = () => {
        setLoading(true);
        getCustomers().then(res => {
            setCustomers(res.data)
        }).catch(err => {
            setError(err.response.data.message)
            errorNotification(
                err.code,
                err.response.data.message
            )
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) {
        return (
            <SidebarWithHeader>
                <VStack spacing={4} align="center" justify="center" minH="200px">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                    <Text>Loading customers...</Text>
                </VStack>
            </SidebarWithHeader>
        );
    }

    if (err) {
        return (
            <SidebarWithHeader>
                <VStack spacing={4} align="center" justify="center" minH="200px">
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {err}
                    </Alert>
                    <Button
                        colorScheme="blue"
                        onClick={fetchCustomers}
                        isLoading={loading}
                    >
                        Retry Connection
                    </Button>
                    <CreateCustomerDrawer fetchCustomers={fetchCustomers} />
                </VStack>
            </SidebarWithHeader>
        );
    }

    if (customers.length <= 0) {
        return (
            <SidebarWithHeader>
                <VStack spacing={4} align="center" justify="center" minH="200px">
                    <Text fontSize="lg" color="gray.500">No customers available</Text>
                    <CreateCustomerDrawer fetchCustomers={fetchCustomers} />
                </VStack>
            </SidebarWithHeader>
        );
    }

    return (
        <SidebarWithHeader>
            <CreateCustomerDrawer fetchCustomers={fetchCustomers} />
            <Wrap justify={"center"} spacing={"30px"}>
                {customers.map((customer, index) => (
                    <WrapItem key={customer.id || index}>
                        <CardWithImage
                            {...customer}
                            imageNumber={index}
                            fetchCustomers={fetchCustomers}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </SidebarWithHeader>
    );
};

export default Customer;