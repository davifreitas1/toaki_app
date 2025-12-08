import React from 'react';

const OpcoesSocial = () => {
  return (
    <div className="flex justify-center gap-4 mt-3">
      {[1, 2, 3].map((item) => (
        <button
          key={item}
          className="
            w-[26px]
            h-[26px]
            bg-[#D9D9D9]
            rounded-[5px]
            hover:bg-[#cfcfcf]
            transition-colors
          "
          title="Login Social (Simulado)"
          type="button"
        />
      ))}
    </div>
  );
};

export default OpcoesSocial;
