import React, { ReactNode } from 'react';

const FooterComp = (): ReactNode => {
    return (
        <footer className='relative w-full bg-black h-80 border-dashed border-t-2 border-gray-800 pt-8 pb-6'>
            <div className='container mx-auto px-8'>
                <div className='flex flex-wrap text-left lg:text-left'>
                    <div className='w-full lg:w-6/12 px-4'>
                        <h4 className="text-3xl font-semibold text-white">
                            Let&apos;s Keep in touch!
                        </h4>
                        <p className='text-white'>asdasdasd</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterComp;
