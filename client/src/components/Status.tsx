import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { colors } from '../utils/globalVars';

const Status = ({ activeStatus, setStatus }: any) => {
    const handleSetActive = async (color: any) => {
        setStatus(activeStatus === color ? '' : color);
    };

    return (
        <>
            <Box
                w='full'
                py={3}
                pt='1.5rem'
                bg='white'
                _dark={{
                    bg: 'gray.700',
                }}
                mb='1.5rem'
                px={{ base: 4, md: 3, xl: 4 }}
                shadow='sm'
                rounded='md'
                className='sidebarCard'
            >
                <Flex wrap='wrap'>
                    {Object.keys(colors).map((color: any) => {
                        return (
                            <Button
                                onClick={() => handleSetActive(color)}
                                rounded='0.3rem'
                                mr='0.7rem'
                                mb='0.7rem'
                                fontSize='xs'
                                fontWeight='400'
                                bg={activeStatus === color ? colors[color] : '#cfedfb'}
                                color={activeStatus === color ? 'gray.50' : 'linkedin.800'}
                                _hover={{
                                    bg: colors[color],
                                    color: 'gray.50',
                                }}
                                _dark={{
                                    bg: activeStatus === color ? colors[color] : '#9bdaf329',
                                    color: activeStatus === color ? 'gray.50' : 'linkedin.200',
                                    _hover: {
                                        bg: colors[color],
                                        color: 'gray.50',
                                    },
                                }}
                                size='xs'
                                textTransform='capitalize'
                            >
                                {color}
                            </Button>
                        );
                    })}
                </Flex>
            </Box>
        </>
    );
};

export default Status;
