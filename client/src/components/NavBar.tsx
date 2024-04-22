import React, { useContext, useEffect } from 'react';
import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { UserContext } from '../context/Context';

const NavBar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { userDetails } = useContext(UserContext);

    useEffect(() => {
        localStorage.getItem('track-jobs');
    }, [userDetails]);

    const handleLogout = () => {
        window.localStorage.removeItem('track-jobs');
        window.location.reload();
    };

    return (
        <>
            <Box bg={useColorModeValue('white', 'dark')} px={4}>
                <Flex
                    h={16}
                    px={{ base: 2, md: 20, xl: 40 }}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Box
                        fontFamily={'heading'}
                        fontWeight={'bold'}
                        fontSize={'1.7rem'}
                        color='linkedin.500'
                    >
                        <Link
                            href='/'
                            className='logo'
                            _hover={{
                                textDecoration: 'none',
                            }}
                        >
                            <Flex alignItems={'center'}>
                                <Box as='span' pb='0.2rem'>
                                    <RepeatClockIcon />
                                </Box>
                                <Text ml='1'>JobTrackr</Text>
                            </Flex>
                        </Link>
                    </Box>

                    <Flex align={'center'}>
                        <Stack
                            direction={'row'}
                            spacing={4}
                            display='flex'
                            alignItems={'center'}
                        >
                            <Button onClick={toggleColorMode} size='sm'>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>

                            {userDetails && (
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        rounded={'full'}
                                        variant={'link'}
                                        cursor={'pointer'}
                                        minW={0}
                                        _hover={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Avatar
                                            size={'md'}
                                            name={
                                                userDetails &&
                                                userDetails.user.firstName +
                                                ' ' +
                                                userDetails.user.lastName
                                            }
                                            //   src={
                                            //     userDetails &&
                                            //     userDetails.user.picture &&
                                            //     userDetails.user.picture
                                            //   }
                                        />
                                    </MenuButton>
                                    <MenuList alignItems={'center'}>
                                        <Center>
                                            <Avatar
                                                size={'xl'}
                                                name={
                                                    userDetails &&
                                                    userDetails.user.firstName +
                                                    ' ' +
                                                    userDetails.user.lastName
                                                }
                                                // src={
                                                //   userDetails &&
                                                //   userDetails.user.picture &&
                                                //   userDetails.user.picture
                                                // }
                                                mb='0.5rem'
                                            />
                                        </Center>
                                        <Center>
                                            <p>
                                                {userDetails &&
                                                    userDetails.user.firstName +
                                                    ' ' +
                                                    userDetails.user.lastName}
                                            </p>
                                        </Center>
                                        <MenuDivider />
                                        <MenuItem>Account Settings</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </MenuList>
                                </Menu>
                            )}
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default NavBar;
