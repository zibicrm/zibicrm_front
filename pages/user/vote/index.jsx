import React, { useEffect } from 'react'
import LayoutUser from '../../../Layout/LayoutUser'
import Image from 'next/image';
import { ImageBuilding } from '../../../assets/Images';
import { usePatientAuth } from '../../../Provider/PatientAuthProvider';

const VotePage = () => {
  const { user, loading } = usePatientAuth();

  useEffect(() => {
    if (!loading && !user && !user?.token) {
      router.push("/user/user-login");
    }
  }, []);

  return (
    <LayoutUser>
      <div className="md:mt-8">
        <h1 className="text-gray-900 md:font-bold md:text-xl md:mt-8 ">نظر سنجی</h1>
        <div className="mt-24 flex flex-col items-center justify-center ">
          <div className="relative items-center justify-center w-[196px] h-[108px] md:w-[457px] md:h-[257px] ">
            <Image src={ImageBuilding} alt=""  layout="fill"/>
          </div>
          <p className="text-sm md:text-base text-gray-500 text-center mt-6 md:mt-8">
            این صفحه در دست طراحی می باشد
          </p>
        </div>
      </div>
    </LayoutUser>
  );
}

export default VotePage