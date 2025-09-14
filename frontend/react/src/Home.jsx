import SidebarWithHeader from "./components/shared/SideBar.jsx";
import {
    Text,
    Box,
    VStack,
    HStack,
    Button,
    useColorModeValue,
    SimpleGrid,
    Icon,
    Flex,
    Circle,
    keyframes,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Image,
    AspectRatio
} from "@chakra-ui/react";
import {
    FiUsers,
    FiUserPlus,
    FiSettings,
    FiHelpCircle,
    FiStar,
    FiHeart,
    FiTrendingUp,
    FiCoffee,
    FiSun,
    FiMoon
} from "react-icons/fi";
import { useState, useEffect } from 'react';

const Home = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bgGradient = useColorModeValue(
        'linear(to-br, blue.50, purple.50, pink.50)',
        'linear(to-br, gray.900, purple.900, blue.900)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const textPrimary = useColorModeValue('gray.800', 'white');
    const textSecondary = useColorModeValue('gray.600', 'gray.300');
    const accentColor = useColorModeValue('blue.500', 'blue.300');

    const float = keyframes`
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    `;

    const pulse = keyframes`
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    `;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour >= 6 && hour < 12) {
            return { text: "Good Morning!", icon: FiSun, color: "orange.400" };
        }
        if (hour >= 12 && hour < 18) {
            return { text: "Good Afternoon!", icon: FiCoffee, color: "blue.400" };
        }
        if (hour >= 18 && hour < 20) {
            return { text: "Good Evening!", icon: FiMoon, color: "purple.400" };
        }
        return { text: "Good Night!", icon: FiStar, color: "teal.400" };
    };

    const greeting = getGreeting();

    return (
        <SidebarWithHeader>
            <Box
                minH="100vh"
                bgGradient={bgGradient}
                p={8}
                position="relative"
                overflow="hidden"
            >
                <Circle
                    size="120px"
                    bg="blue.200"
                    opacity={0.1}
                    position="absolute"
                    top="10%"
                    right="10%"
                    animation={`${float} 6s ease-in-out infinite`}
                />
                <Circle
                    size="80px"
                    bg="blue.200"
                    opacity={0.1}
                    position="absolute"
                    bottom="15%"
                    left="5%"
                    animation={`${float} 4s ease-in-out infinite reverse`}
                />

                <VStack spacing={12} align="stretch" maxW="6xl" mx="auto">
                    <VStack spacing={6} textAlign="center" py={8}>
                        <HStack spacing={4}>
                            <Icon
                                as={greeting.icon}
                                boxSize={12}
                                color={greeting.color}
                                animation={`${pulse} 2s ease-in-out infinite`}
                            />
                            <Text fontSize="5xl" fontWeight="bold" color={textPrimary}>
                                {greeting.text}
                            </Text>
                        </HStack>

                        <Text fontSize="xl" color={textSecondary} maxW="2xl">
                            Welcome to your Customer Management Hub
                        </Text>
                    </VStack>

                    <Flex justify="center" align="center" w="full">
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
                            onClick={() => window.location.href = "/dashboard/customers"}
                            maxW="lg"
                        >
                            <VStack spacing={6}>
                                <Circle size="20" bg="blue.100" color="blue.500">
                                    <Icon as={FiUsers} boxSize={10} />
                                </Circle>
                                <VStack spacing={2} textAlign="center">
                                    <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                                        Manage Customers
                                    </Text>
                                    <Text color={textSecondary}>
                                        View, add, and organize all your customer relationships in one place
                                    </Text>
                                </VStack>
                                <Button colorScheme="purple" size="lg" borderRadius="full">
                                    Get Started
                                </Button>
                            </VStack>
                        </Box>
                    </Flex>

                    <Box
                        bg={cardBg}
                        borderRadius="2xl"
                        p={6}
                        shadow="lg"
                        textAlign="center"
                        border="1px"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                    >
                        <HStack justify="center" spacing={8}>
                            <VStack spacing={1}>
                                <Icon as={FiStar} color={accentColor} boxSize={6} />
                                <Text fontSize="sm" color={textSecondary} fontWeight="medium">
                                    Today
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                                    {currentTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            </VStack>
                            <VStack spacing={1}>
                                <Icon as={FiHeart} color="red.400" boxSize={6} />
                                <Text fontSize="sm" color={textSecondary} fontWeight="medium">
                                    Current Time
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                                    {currentTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </Text>
                            </VStack>
                        </HStack>
                    </Box>

                    <Box textAlign="center">
                        <Button
                            colorScheme="blue"
                            size="lg"
                            borderRadius="full"
                            onClick={onOpen}
                            leftIcon={<Icon as={FiHelpCircle} />}
                            _hover={{
                                transform: "translateY(-2px)",
                                shadow: "xl"
                            }}
                            transition="all 0.3s ease"
                            shadow="lg"
                        >
                            View Technical Details
                        </Button>
                    </Box>
                </VStack>

                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay backdropFilter="blur(10px)" />
                    <ModalContent borderRadius="2xl">
                        <ModalHeader textAlign="center" fontSize="2xl">
                            🛠️ Full-Stack Architecture
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={8}>
                            <VStack spacing={6}>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                                    <Box p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.200">
                                        <VStack spacing={3}>
                                            <Circle size="12" bg="blue.500">
                                                <Text fontSize="xl">⚛️</Text>
                                            </Circle>
                                            <Text fontWeight="bold" color="blue.700">Frontend</Text>
                                            <Text fontSize="sm" textAlign="center" color="gray.600">
                                                React with Chakra UI components, JWT authentication, and responsive design
                                            </Text>
                                        </VStack>
                                    </Box>
                                    <Box p={4} bg="green.50" borderRadius="lg" border="1px" borderColor="green.200">
                                        <VStack spacing={3}>
                                            <Circle size="12" bg="green.500">
                                                <Text fontSize="xl">🍃</Text>
                                            </Circle>
                                            <Text fontWeight="bold" color="green.700">Backend</Text>
                                            <Text fontSize="sm" textAlign="center" color="gray.600">
                                                Spring Boot with 20+ REST APIs, Spring Security, and optimized performance
                                            </Text>
                                        </VStack>
                                    </Box>
                                    <Box p={4} bg="purple.50" borderRadius="lg" border="1px" borderColor="purple.200">
                                        <VStack spacing={3}>
                                            <Circle size="12" bg="blue.500">
                                                <Text fontSize="xl">📊</Text>
                                            </Circle>
                                            <Text fontWeight="bold" color="blue.700">Database</Text>
                                            <Text fontSize="sm" textAlign="center" color="gray.600">
                                                PostgreSQL for reliable data storage and complex customer relationships
                                            </Text>
                                        </VStack>
                                    </Box>
                                    <Box p={4} bg="orange.50" borderRadius="lg" border="1px" borderColor="orange.200">
                                        <VStack spacing={3}>
                                            <Circle size="12" bg="orange.500" color="white">
                                                <Icon as={FiStar} boxSize={6} />
                                            </Circle>
                                            <Text fontWeight="bold" color="orange.700">Cloud Services</Text>
                                            <Text fontSize="sm" textAlign="center" color="gray.600">
                                                AWS S3 integration for secure image uploads and file management
                                            </Text>
                                        </VStack>
                                    </Box>
                                </SimpleGrid>

                                <Box p={6} bg="gray.50" borderRadius="lg" w="full">
                                    <VStack spacing={4}>
                                        <HStack>
                                            <Icon as={FiTrendingUp} color="green.500" boxSize={6} />
                                            <Text fontWeight="bold" fontSize="lg">Performance Optimizations</Text>
                                        </HStack>
                                        <Text textAlign="center" color="gray.600">
                                            Achieved 35% reduction in backend latency through service optimization,
                                            efficient database queries, and smart caching strategies.
                                        </Text>
                                    </VStack>
                                </Box>

                                <Button colorScheme="blue" size="lg" borderRadius="full" onClick={onClose}>
                                    Close
                                </Button>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </SidebarWithHeader>
    );
};

export default Home;