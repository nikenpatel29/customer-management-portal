import React, { useState, useRef } from 'react';
import SidebarWithHeader from "./components/shared/SideBar.jsx";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useColorModeValue,
    FormControl,
    FormLabel,
    Input,
    Avatar,
    useToast,
    Card,
    CardBody,
    Heading
} from '@chakra-ui/react';
import { FiEdit3, FiSave } from "react-icons/fi";
import { useAuth } from "./components/context/AuthContext.jsx";

const Settings = () => {
    const { customer, updateCustomerProfile } = useAuth();
    const toast = useToast();
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        profilePicture: customer?.profilePicture || ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid File",
                description: "Please select an image file.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64String = e.target.result;

            const updatedProfile = {
                ...profileData,
                profilePicture: base64String
            };

            setProfileData(updatedProfile);

            await updateCustomerProfile({
                ...customer,
                profilePicture: base64String
            });

            toast({
                title: "Profile Picture Updated",
                description: "Your profile picture has been changed.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);

        try {
            await updateCustomerProfile({
                ...customer,
                firstName: profileData.firstName,
                lastName: profileData.lastName
            });

            toast({
                title: "Profile Updated",
                description: "Your name has been saved.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Something went wrong. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SidebarWithHeader>
            <Box minH="100vh" p={8}>
                <VStack spacing={8} align="stretch" maxW="md" mx="auto">
                    <VStack spacing={4} textAlign="center">
                        <Heading size="xl">Profile Settings</Heading>
                        <Text color="gray.600">Update your profile information</Text>
                    </VStack>

                    <Card>
                        <CardBody>
                            <VStack spacing={6}>
                                <VStack spacing={4}>
                                    <Avatar
                                        size="2xl"
                                        src={profileData.profilePicture}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        leftIcon={<FiEdit3 />}
                                        onClick={() => fileInputRef.current?.click()}
                                        isLoading={isLoading}
                                    >
                                        Change Photo
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                </VStack>

                                <HStack spacing={4} w="full">
                                    <FormControl>
                                        <FormLabel>First Name</FormLabel>
                                        <Input
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                                        />
                                    </FormControl>
                                </HStack>

                                <Button
                                    colorScheme="blue"
                                    leftIcon={<FiSave />}
                                    onClick={handleSaveProfile}
                                    w="full"
                                    isLoading={isLoading}
                                >
                                    Save Changes
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Box>
        </SidebarWithHeader>
    );
};

export default Settings;