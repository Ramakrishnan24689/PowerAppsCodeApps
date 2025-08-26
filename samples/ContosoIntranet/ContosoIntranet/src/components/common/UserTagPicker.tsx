import { useState, useCallback } from 'react';
import {
  Combobox,
  Option,
  Field,
  Spinner,
  makeStyles,
  tokens,
  Tag,
  Button,
  useId
} from '@fluentui/react-components';
import { PersonRegular, DismissRegular } from '@fluentui/react-icons';
import { Office365UsersService } from '../../Services/Office365UsersService';
import type { User } from '../../Models/Office365UsersModel';
import { fixPowerAppsResult } from '../../utils/powerAppsResultFix';
import { useQuery } from '@tanstack/react-query';

const useStyles = makeStyles({
  field: {
    width: '100%',
    '& > div': {
      width: '100%',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    width: '100%',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userName: {
    fontWeight: tokens.fontWeightMedium,
  },
  userEmail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  combobox: {
    width: '100%',
    '& input': {
      width: '100%',
    },
  },
});

interface UserTagPickerProps {
  selectedUsers?: User[];
  onSelectionChange?: (users: User[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  maxSelectedUsers?: number; // New prop to limit selection
}

export default function UserTagPicker({
  selectedUsers = [],
  onSelectionChange,
  placeholder = 'Search for people...',
  label = 'Assigned To',
  disabled = false,
  maxSelectedUsers = 10, // Default to 10, can be overridden
}: UserTagPickerProps) {
  const styles = useStyles();
  const comboId = useId();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Search users when query changes
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['searchUsers', query],
    queryFn: async () => {
      if (!query || query.length < 2) return { result: { value: [] } };
      
      const result = await Office365UsersService.SearchUserV2(query, 10, true);
      const fixedResult = fixPowerAppsResult(result);
      
      // Return the fixed result, but ensure it has the expected structure
      if (!fixedResult.isSuccess) {
        console.error('UserTagPicker: Search failed:', fixedResult.error);
        return { result: { value: [] } };
      }
      
      return fixedResult;
    },
    enabled: query.length >= 2,
    staleTime: 30000, // 30 seconds
  });

  const users = searchResults?.result?.value || [];

  const handleSelectionChange = useCallback((_: any, data: any) => {
    if (!data.optionValue || !onSelectionChange) return;
    
    const selectedUser = users.find((user: User) => user.Id === data.optionValue);
    if (!selectedUser) return;

    const updatedUsers = [...selectedUsers];
    const existingIndex = updatedUsers.findIndex(user => user.Id === selectedUser.Id);
    
    if (existingIndex === -1 && selectedUsers.length < maxSelectedUsers) {
      // For single user selection (maxSelectedUsers = 1), replace instead of add
      if (maxSelectedUsers === 1) {
        onSelectionChange([selectedUser]);
      } else {
        updatedUsers.push(selectedUser);
        onSelectionChange(updatedUsers);
      }
    }
    
    setQuery(''); // Clear search after selection
  }, [selectedUsers, onSelectionChange, users, maxSelectedUsers]);

  const handleTagRemove = useCallback((userId: string) => {
    if (!onSelectionChange) return;
    
    const updatedUsers = selectedUsers.filter(user => user.Id !== userId);
    onSelectionChange(updatedUsers);
  }, [selectedUsers, onSelectionChange]);

  // Filter out already selected users
  const availableUsers = users.filter((user: User) => 
    !selectedUsers.some(selected => selected.Id === user.Id)
  );

  return (
    <Field 
      label={label}
      className={styles.field}
    >
      <div className={styles.container}>
        {selectedUsers.length > 0 && (
          <div className={styles.tagContainer}>
            {selectedUsers.map((user) => (
              <Tag
                key={user.Id}
                shape="rounded"
                media={<PersonRegular />}
                className={styles.tag}
              >
                {user.DisplayName || user.Mail}
                <Button
                  appearance="transparent"
                  size="small"
                  icon={<DismissRegular />}
                  onClick={() => handleTagRemove(user.Id)}
                  disabled={disabled}
                />
              </Tag>
            ))}
          </div>
        )}
        
        <Combobox
          className={styles.combobox}
          id={comboId}
          placeholder={placeholder}
          value={query}
          onInput={(event) => setQuery((event.target as HTMLInputElement).value)}
          onOptionSelect={handleSelectionChange}
          disabled={disabled}
          open={isOpen}
          onOpenChange={(_, data) => setIsOpen(data.open)}
        >
          {isLoading && (
            <Option key="loading" value="loading" text="Searching..." disabled>
              <div className={styles.option}>
                <Spinner size="extra-small" />
                <span>Searching...</span>
              </div>
            </Option>
          )}
          
          {error && (
            <Option key="error" value="error" text="Error searching users" disabled>
              <div className={styles.option}>
                <span>Error searching users</span>
              </div>
            </Option>
          )}
          
          {!isLoading && !error && availableUsers.length === 0 && query.length >= 2 && (
            <Option key="no-results" value="no-results" text="No users found" disabled>
              <div className={styles.option}>
                <span>No users found</span>
              </div>
            </Option>
          )}
          
          {!isLoading && !error && availableUsers.map((user: User) => (
            <Option
              key={user.Id}
              value={user.Id}
              text={user.DisplayName || 'Unknown User'}
            >
              <div className={styles.option}>
                <PersonRegular />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.DisplayName || 'Unknown User'}
                  </span>
                  <span className={styles.userEmail}>
                    {user.Mail || user.MailNickname}
                  </span>
                </div>
              </div>
            </Option>
          ))}
        </Combobox>
      </div>
    </Field>
  );
}
