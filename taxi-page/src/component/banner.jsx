import React from 'react';

const Banner = () => {
  return (
    <div className='w-full h-[640px] relative'>
        <img src="https://res.cloudinary.com/dx2o9ki2g/image/upload/v1725953476/jzpzhaxujlhvs1dnalee.png" alt="banner" className='w-full h-full object-cover' />
        <h1 className='absolute top-[20%] left-[10%] text-7xl font-bold'>XE GHÉP</h1>
        <h2 className='absolute top-[35%] left-[10%] text-7xl font-bold'>HÀ NỘI ⇄ ĐI TỈNH</h2>
        <a href="tel:0123456780" className='absolute top-[50%] left-[10%] text-2xl font-semibold text-white bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition'>
          0123456780
        </a>
    </div>
  );
};

export default Banner;
