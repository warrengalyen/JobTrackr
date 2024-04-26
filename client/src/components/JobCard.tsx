import React from 'react';
import {
    Box,
    Flex,
    Image,
    Link,
    chakra,
    Tooltip,
    useDisclosure,
    Badge,
} from '@chakra-ui/react';
import moment from 'moment';
import NotesModal from './NotesModal';
import { colors, colors_hover } from '../utils/globalVars';

const JobCard = ({
                     loading,
                     setLoading,
                     loading2,
                     setLoading2,
                     error,
                     note,
                     setNote,
                     setError,
                     handleAddNote,
                     handleDeleteNote,
                     ...job
                 }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        link,
        company,
        title,
        description,
        category,
        appliedDate,
        domain,
        image,
        status,
        notes,
        createdAt,
    } = job;

    const daysSinceApplied = moment().diff(moment(appliedDate), 'days', false);
    console.log(daysSinceApplied > 0);

    return (
        <>
            <Box
                className='job-card'
                mx='auto'
                px={8}
                py={4}
                mb='1rem'
                rounded='md'
                shadow='sm'
                bg='white'
                _dark={{
                    bg: 'gray.700',
                }}
                w={{ base: 'full', md: 'full' }}
            >
                <Flex justifyContent='space-between' alignItems='center'>
                    <chakra.span
                        fontSize='0.92rem'
                        color={
                           'gray.600'
                        }
                        _dark={{
                            color: 'gray.400',
                        }}
                        cursor='pointer'
                    >
                        <Tooltip
                            hasArrow
                            label={
                                daysSinceApplied > 0 ? daysSinceApplied + ' Day(s) since applied' : ''
                            }
                            bg='gray.700'
                            color='white'
                            placement='top'
                            fontSize='0.75rem'
                        >
                            {moment(appliedDate).format('MMM Do, YYYY')}
                        </Tooltip>
                    </chakra.span>
                    <Box
                        display='flex'
                        alignItems='center'
                        as='span'
                        px={2}
                        py={1}
                        cursor='pointer'
                        bg={colors[status]}
                        color='gray.100'
                        fontSize='0.7rem'
                        rounded='md'
                        _hover={{
                            bg: colors_hover[status],
                        }}
                        textTransform='capitalize'
                    >
                        {status}
                        <Box fontSize='0.6rem' as='span' ml='0.2rem'>
                            <i className='fa-solid fa-chevron-down'></i>
                        </Box>
                    </Box>
                </Flex>

                <Box mt={2}>
                    <Link
                        fontSize='1.04rem'
                        color='gray.700'
                        _dark={{
                            color: 'gray.50',
                        }}
                        fontWeight='700'
                        _hover={{
                            color: 'gray.600',
                            _dark: {
                                color: 'gray.200',
                            },
                            textDecor: 'none',
                        }}
                        href={`${link}`}
                        target={`_blank`}
                    >
                        {title} - {company}
                    </Link>
                    <chakra.p
                        mt={2}
                        color='gray.600'
                        _dark={{
                            color: 'gray.300',
                        }}
                        fontSize='0.9rem'
                    >
                        {description.substring(0, 230)}
                        {description.length > 143 && '..'}
                    </chakra.p>
                </Box>

                <Flex justifyContent='space-between' alignItems='center' mt={4}>
                    <Flex align='center'>
                        <Image
                            mr='0.3rem'
                            w={6}
                            h={6}
                            rounded='full'
                            fit='cover'
                            src={image}
                            alt='avatar'
                        />
                        <Box
                            as='span'
                            color='gray.700'
                            _dark={{
                                color: 'gray.200',
                            }}
                            fontSize='0.9rem'
                            fontWeight='700'
                        >
                            {domain}
                        </Box>
                    </Flex>
                    <Flex
                        alignItems='center'
                        color='gray.700'
                        _dark={{
                            color: 'gray.200',
                        }}
                    >
                        <Box mr='0.5rem' cursor='pointer' onClick={onOpen} display='flex'>
                            <Tooltip
                                hasArrow
                                label='Add note'
                                bg='gray.300'
                                color='black'
                                placement='top'
                                fontSize='0.75rem'
                            >
                                <i className='fa-solid fa-file-pen'></i>
                            </Tooltip>
                        </Box>
                        <Box cursor='pointer'>
                            <Tooltip
                                hasArrow
                                label='Add to calender'
                                bg='gray.300'
                                color='black'
                                placement='top'
                                fontSize='0.75rem'
                            >
                                <i className='fa-solid fa-calendar-days'></i>
                            </Tooltip>
                            {job && notes.length > 0 && (
                                <Badge
                                    bg='gray.300'
                                    alignSelf='flex-start'
                                    color='gray.800'
                                    fontSize='0.6rem'
                                    rounded='50%'
                                >
                                    {notes.length}
                                </Badge>
                            )}
                        </Box>
                        <NotesModal
                            isOpen={isOpen}
                            onClose={onClose}
                            job={job}
                            loading={loading}
                            setLoading={setLoading}
                            loading2={loading2}
                            error={error}
                            note={note}
                            setNote={setNote}
                            setError={setError}
                            handleAddNote={handleAddNote}
                            handleDeleteNote={handleDeleteNote}
                        />
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default JobCard;
