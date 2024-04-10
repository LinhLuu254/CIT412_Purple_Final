import { Outlet } from 'react-router-dom';
import Header from 'src/components/Header/Header';

export default function PageLayout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
};