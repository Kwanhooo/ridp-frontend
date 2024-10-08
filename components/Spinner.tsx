// components/Spinner.tsx
import * as React from 'react';

const Spinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
        </div>
    );
};

export default Spinner;
