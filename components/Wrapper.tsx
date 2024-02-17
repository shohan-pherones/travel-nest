interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="max-w-[1920px] mx-auto w-full px-4 py-4 xl:px-20">
      {children}
    </div>
  );
};

export default Wrapper;
