import React, { useContext, useEffect, useState } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import AddCategoryModal from './AddCategoryModal';
import Categories from './Categories';
import Stats from './Stats';
import Search from './Search';
import Status from './Status';
import Jobsites from './Jobsites';
import { UserContext } from '../context/Context';
import {
    addCategory,
    deleteCategory,
    editCategory,
} from '../middlewares/category';

interface Query {
    status: string;
    categoryId: string;
}

export const SideBar = ({
                            category,
                            setCategory,
                            activeCat,
                            setActiveCat,
                            sidebar,
                            loadJobs,
                        }: any) => {
    const toast = useToast();
    const { userDetails } = useContext(UserContext);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [loading, setLoading] = useState<Boolean>(false);
    const [loading2, setLoading2] = useState<Boolean>(false);
    const [error, setError] = useState('');
    const [value, setValue] = useState<string>('');
    const [edit, setEdit] = useState<string>('');
    const [editValue, setEditValue] = useState<string>('');
    const [status, setStatus] = useState<string>('all jobs');

    //get default list and store in variable
    const defaultActive = category && category.length > 0 && category[0]._id;

    const handleLoadJobs = async () => {
        try {
            await loadJobs(
                userDetails.user._id,
                { status: status === 'all jobs' ? '' : status, category: activeCat },
                userDetails.token
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddCategory = async () => {
        try {
            const res = await addCategory(
                userDetails.user._id,
                { name: value },
                userDetails.token
            );
            if (res.data) {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    onClose();
                    setCategory(res.data);
                    toast({
                        title: `'${value}' added to your Categories`,
                        status: 'success',
                        duration: 4000,
                        isClosable: true,
                        position: 'top',
                    });
                    setValue('');
                }, 2000);
            }
        } catch (error) {
            if (error.response.status === 400) setError(error.response.data);
            setLoading(false);
        }
    };

    const handleCategoryEdit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError('');
        try {
            const res = await editCategory(
                userDetails.user._id,
                { categoryId: edit, name: editValue },
                userDetails.token
            );
            setLoading(true);

            if (res.data) {
                setTimeout(() => {
                    setCategory(res.data);
                    setEdit('');
                    setLoading(false);
                }, 2000);
            }
        } catch (error) {
            setError(error.response.data);
        }
    };

    const handleCategoryDelete = async (categoryId: any) => {
        try {
            const res = await deleteCategory(
                userDetails.user._id,
                { categoryId: categoryId },
                userDetails.token
            );
            setLoading2(true);
            if (res.data) {
                setTimeout(() => {
                    setCategory(res.data);
                    setLoading2(false);
                }, 2000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleLoadJobs();
    }, [status, activeCat]);

    return (
        <>
            <Search />
            <Stats />
            <Status activeStatus={status} setStatus={setStatus} />
            <Jobsites />
            <Categories
                loading={loading}
                loading2={loading2}
                error={error}
                setError={setError}
                defaultActive={defaultActive}
                edit={edit}
                onOpen={onOpen}
                category={category}
                setEditValue={setEditValue}
                editValue={editValue}
                handleCategoryEdit={handleCategoryEdit}
                setEdit={setEdit}
                activeCat={activeCat}
                setActiveCat={setActiveCat}
                handleCategoryDelete={handleCategoryDelete}
            />
            <AddCategoryModal
                value={value}
                setValue={setValue}
                loading={loading}
                handleSubmit={handleAddCategory}
                isOpen={isOpen}
                onClose={onClose}
                error={error}
                setError={setError}
            />
        </>
    );
};

export default SideBar;
