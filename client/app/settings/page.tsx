import ComingSoon from "@/components/common/ComingSoon";
import Description from "@/components/common/Description";
import PageContainer from "@/components/common/PageContainer";
import Title from "@/components/common/Title";

const SettingsPage = () => {
  return (
    <PageContainer>
      <div>
        <Title>Settings</Title>
        <Description className="mt-1">Manage your preferences and account</Description>
      </div>

      <ComingSoon />
    </PageContainer>
  );
};

export default SettingsPage;