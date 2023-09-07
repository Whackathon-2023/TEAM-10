import LiquidLevelChart from "~/components/chart/bar";
import TypographyH1 from "~/components/typography/h1";

const Visualisation = () => {
  const liquidLevelData: number[] = [
    1000, 1000, 1000, 12000, 12000, 12000, 12000, 12000, 12000, 12000,
  ];

  return (
    <>
      <div className="mt-32 min-h-screen w-auto lg:ml-32 xl:ml-44 2xl:ml-72">
        <TypographyH1 className="mb-56 max-w-lg text-center text-6xl font-semibold text-grey-dark">
          Liquid Level Chart
        </TypographyH1>
        <LiquidLevelChart title="Tank 1" data={liquidLevelData} />
      </div>
    </>
  );
};

export default Visualisation;
