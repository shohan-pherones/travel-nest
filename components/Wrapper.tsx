const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1920px] mx-auto w-full px-4 py-4 xl:px-20">
      {children}
    </div>
  );
};

export default Wrapper;
