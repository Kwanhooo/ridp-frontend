// pages/page1.tsx
import NavigationLayout from '@/components/NavigationLayout';

const Page = () => {
    return (
        <NavigationLayout>
            <h1 className="text-4xl font-bold text-gray-200">Page 1</h1>
            <p className="mt-4 text-gray-400">
                Page 1
            </p>
        </NavigationLayout>
    );
};

export default Page;
