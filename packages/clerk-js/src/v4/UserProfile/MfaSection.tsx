import { PhoneNumberResource } from '@clerk/types/src';
import React from 'react';

import { useCoreUser } from '../../ui/contexts';
import { useNavigate } from '../../ui/hooks';
import { Badge, Col, Icon } from '../customizables';
import { FormattedPhoneNumberText, useCardState } from '../elements';
import { Mobile } from '../icons';
import { handleError } from '../utils';
import { LinkButtonWithDescription } from './LinkButtonWithDescription';
import { ProfileSection } from './Section';
import { UserProfileAccordion } from './UserProfileAccordion';
import { AddBlockButton } from './UserProfileBlockButtons';
import { defaultFirst } from './utils';

export const MfaSection = () => {
  const { navigate } = useNavigate();
  const user = useCoreUser();
  const mfaPhones = user.phoneNumbers
    .filter(ph => ph.verification.status === 'verified')
    .filter(ph => ph.reservedForSecondFactor)
    .sort(defaultFirst);

  return (
    <ProfileSection
      title='Two-step authentication'
      id='mfa'
    >
      {mfaPhones.map(phone => (
        <MfaAccordion
          key={phone.id}
          phone={phone}
        />
      ))}
      <AddBlockButton onClick={() => navigate('multi-factor')}>Add authentication step</AddBlockButton>
    </ProfileSection>
  );
};

const MfaAccordion = (props: { phone: PhoneNumberResource }) => {
  const { phone } = props;
  const { navigate } = useNavigate();
  const card = useCardState();
  const isDefault = phone.defaultSecondFactor;

  return (
    <UserProfileAccordion
      icon={
        <Icon
          icon={Mobile}
          sx={theme => ({ color: theme.colors.$blackAlpha700 })}
        />
      }
      title={
        <>
          SMS Code <FormattedPhoneNumberText value={phone.phoneNumber} />
        </>
      }
      badge={isDefault ? <Badge>Default</Badge> : undefined}
    >
      <Col gap={4}>
        <LinkButtonWithDescription
          title={isDefault ? 'Default factor' : 'Set as Default factor'}
          subtitle={
            isDefault
              ? 'This factor will be used as the default multifactor authentication method when signing in.'
              : 'Set this factor as the default factor to use it as the default multifactor authentication method when signing in.'
          }
          actionLabel={!isDefault ? 'Set as primary' : undefined}
          onClick={() => phone.makeDefaultSecondFactor().catch(err => handleError(err, [], card.setError))}
        />
        <LinkButtonWithDescription
          title='Remove'
          subtitle='Remove this phone number from the multifactor authentication methods'
          actionLabel='Remove phone number'
          colorScheme='danger'
          onClick={() => navigate(`multi-factor/${phone.id}/remove`)}
        />
      </Col>
    </UserProfileAccordion>
  );
};