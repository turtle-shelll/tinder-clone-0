import React, { useEffect } from 'react'
import Header from '../../Component/HeaderC/Header';
import TinderCards from '../../Component/Card/Card';
import Footer from '../../Component/FooterC/Footer';
import { allUserInitialData } from '../../storeSlice';
import { useDispatch } from 'react-redux';

export default function HomeScreen() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(allUserInitialData());
    }, []);
    return (
        <div>
            <Header />
            <TinderCards />
            <Footer />
        </div>
    );
};