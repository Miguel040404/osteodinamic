import { ClassesGrid } from "./ClassesGrid";
import { HomeHeader } from "./HomeHeader";
import { HowItWorksSection } from "./HowItWorkSection";

export const HomeContent = ({ classCounts, notificationCount }) => (
  <>
    <HomeHeader notificationCount={notificationCount} />
    <ClassesGrid classCounts={classCounts} />
    <HowItWorksSection />
  </>
);