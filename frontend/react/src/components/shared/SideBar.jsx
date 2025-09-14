import React from 'react';
import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button
} from "@chakra-ui/react";

import {
    FiHome,
    FiMenu,
    FiSettings,
    FiUsers
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Add this import
import {useAuth} from "../context/AuthContext.jsx";
import Picture from "../../assets/UT_Austin_Nodes.png";
import { ChevronDownIcon } from "@chakra-ui/icons";

const LinkItems = [
    {name: 'Home', route: '/dashboard', icon: FiHome},
    {name: 'Customers', route: '/dashboard/customers',  icon: FiUsers},
    {name: 'Settings', route: '/dashboard/settings', icon: FiSettings},
];

export default function SidebarWithHeader({children}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{base: 'none', md: 'block'}}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose}/>
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen}/>
            <Box ml={{base: 0, md: 60}} p="4">
                {children}
            </Box>
        </Box>
    );
}

const SidebarContent = ({onClose, ...rest}) => {
    const navigate = useNavigate(); // Add navigation hook

    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{base: 'full', md: 60}}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" flexDirection="column" alignItems="center" mx="8" mb={75} mt={2} justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" mb={5}>
                    Dashboard
                </Text>
                <Image
                    borderRadius='full'
                    boxSize='75px'
                    src={Picture}
                    alt='Dashboard Picture'
                />
                <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} route={link.route} icon={link.icon} navigate={navigate}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({icon, route, children, navigate, ...rest}) => {
    // Use onClick handler instead of Link href for better control
    const handleClick = () => {
        navigate(route);
    };

    return (
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            onClick={handleClick} // Add click handler
            _hover={{
                bg: 'blue.400',
                color: 'white',
            }}
            {...rest}>
            {icon && (
                <Icon
                    mr="4"
                    fontSize="16"
                    _groupHover={{
                        color: 'white',
                    }}
                    as={icon}
                />
            )}
            {children}
        </Flex>
    );
};

const MobileNav = ({onOpen, ...rest}) => {
    const { customer, logOut } = useAuth();
    const navigate = useNavigate(); // Add navigation hook

    const profilePicture = customer?.profilePicture ||
        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9';

    const displayName = customer?.firstName && customer?.lastName
        ? `${customer.firstName} ${customer.lastName}`
        : customer?.username || 'User';

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Menu>
          <MenuButton as={Button} variant="ghost" px={2} py={2} rightIcon={<ChevronDownIcon />}>
            <HStack>
              <Avatar size={"sm"} src={profilePicture} />
              <VStack
                display={{ base: "none", md: "flex" }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm">{displayName}</Text>
              </VStack>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate("/dashboard/settings")}>Settings</MenuItem>
            <MenuItem
              onClick={() => {
                  logOut()
                  navigate("/");
              }}
            >
              Sign Out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};