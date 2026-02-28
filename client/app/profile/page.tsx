import ComingSoon from "@/components/common/ComingSoon";
import Description from "@/components/common/Description";
import PageContainer from "@/components/common/PageContainer";
import Title from "@/components/common/Title";

const ProfilePage = () => {
  return (
    <PageContainer>
      <div>
        <Title>Profile</Title>
        <Description className="mt-1">Manage your profile and settings</Description>
      </div>

      <ComingSoon />
    </PageContainer>
  );
};

export default ProfilePage;