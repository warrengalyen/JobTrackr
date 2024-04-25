import React, { useState } from 'react';
import {
    Box,
    Input,
    InputGroup,
    InputRightAddon,
    Spinner,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

const Search = () => {
    const [loading, setLoading] = useState<Boolean>(false);
    return (
        <>
            <Box
                w='full'
                py={3}
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
                <InputGroup size='sm'>
                    <Input
                        _dark={{
                            _placeholder: { color: 'gray.300' },
                        }}
                        type='tel'
                        placeholder='Search job'
                        focusBorderColor='brand.400'
                        rounded='md'
                        // value={link}
                        // onChange={handleChange('link')}
                    />
                    <InputRightAddon
                        bg='gray.50'
                        _dark={{
                            bg: 'gray.500',
                            color: 'white',
                        }}
                        _hover={{
                            bg: 'gray.100',
                            _dark: {
                                bg: 'gray.400',
                            },
                        }}
                        color='gray.500'
                        rounded='md'
                        cursor='pointer'
                        // onClick={handlefetchJob}
                    >
                        {loading ? <Spinner size='xs' /> : <Search2Icon />}
                    </InputRightAddon>
                </InputGroup>
            </Box>
        </>
    );
};

export default Search;
