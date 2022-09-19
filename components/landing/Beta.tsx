const Beta: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6">
      <p className="text-4xl font-extrabold mb-1 text-center dark:text-primary-500">
        NFT sales
      </p>

      <div className="text-sm text-center space-y-2">
        <p>Want to sell NFTs directly from your bio?</p>
        <p>Sign up below for early access.</p>
      </div>
      <div className="place-self-center">
        <a
          type="button"
          href="https://forms.gle/vgfbYqCPgc3H1iKZ8"
          target="noref"
        >
          <button className="inline-flex items-center justify-center rounded-md  bg-secondary-500 px-4 py-2 text-sm font-medium text-white shadow-sm  sm:w-auto">
            Early access
          </button>
        </a>
      </div>
    </div>
  );
};

export default Beta;
