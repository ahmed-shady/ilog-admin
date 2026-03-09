
import React, { useState, useCallback, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import { MultiValue, GroupBase, OptionsOrGroups, components, MenuListProps, SingleValue } from 'react-select';
import { searchDoctors } from '@app/api/DoctorsService';
import { DoctorFilterDto } from '@app/types/DoctorFilterDto';
import './UserSelector.scss';
import './../../scss/option-selector.scss';
import UserPreview from '../user-preview/UserPreview';
import { selectStyles } from '@app/utils/SelectStyles';

interface UserOption {
  value: number;
  label: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface UserSelectorProps {
  label: string;
  name: string;
  value: number[];
  onChange: (selectedIds: number[]) => void;
  placeholder?: string;
  isMulti?: boolean;
  pageSize?: number; // Number of users per page
}

const UserSelector: React.FC<UserSelectorProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select users...',
  isMulti = true,
  pageSize = 20
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentSearch, setCurrentSearch] = useState('');
  const [loadedOptions, setLoadedOptions] = useState<UserOption[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Map<number, UserOption>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectRef = useRef<any>(null);

  // Load users from backend using searchDoctors API
  const loadUsersFromBackend = async (searchQuery: string, page: number): Promise<{
    users: UserOption[];
    hasMore: boolean;
    totalPages: number;
  }> => {
    try {
      const filter: DoctorFilterDto = {
        name: searchQuery || undefined // Only use name filter
      };

      const response = await searchDoctors(filter, page, pageSize);
      
      const users: UserOption[] = response.content.map(doctor => ({
        value: doctor.id,
        label: `${doctor.name} (${doctor.email})`,
        name: doctor.name,
        email: doctor.email,
        profileImage: doctor.profileImage
      }));

      return {
        users,
        hasMore: !response.last, // Spring Boot pagination provides 'last' flag
        totalPages: response.totalPages
      };
    } catch (error) {
      console.error('Error loading users from backend:', error);
      return {
        users: [],
        hasMore: false,
        totalPages: 0
      };
    }
  };

  const loadOptions = useCallback(
    (
      inputValue: string,
      callback: (options: OptionsOrGroups<UserOption, GroupBase<UserOption>>) => void
    ) => {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // If search query changed, reset pagination
      if (inputValue !== currentSearch) {
        setCurrentSearch(inputValue);
        setCurrentPage(0);
        setLoadedOptions([]);
        setHasMore(true);
      }

      // Don't search if less than 3 characters (unless it's empty for initial load)
      if (inputValue.length > 0 && inputValue.length < 3) {
        callback([]);
        return;
      }

      // Debounce the search
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const result = await loadUsersFromBackend(inputValue, 0);
          
          // Merge with selected options to avoid losing them
          const mergedOptions = mergOptionsWithSelected(result.users);
          
          setLoadedOptions(mergedOptions);
          setHasMore(result.hasMore);
          setCurrentPage(0);
          
          callback(mergedOptions);
        } catch (error) {
          console.error('Error loading users:', error);
          callback([]);
        }
      }, 300); // 300ms debounce delay
    },
    [currentSearch, selectedOptionsMap]
  );

  // Merge loaded options with selected options to prevent losing selections
  const mergOptionsWithSelected = useCallback((newOptions: UserOption[]): UserOption[] => {
    const optionsMap = new Map<number, UserOption>();
    
    // First, add all selected options
    selectedOptionsMap.forEach((option, id) => {
      optionsMap.set(id, option);
    });
    
    // Then add new options (won't override selected ones due to Map behavior)
    newOptions.forEach(option => {
      if (!optionsMap.has(option.value)) {
        optionsMap.set(option.value, option);
      }
    });
    
    return Array.from(optionsMap.values());
  }, [selectedOptionsMap]);

  const loadMoreOptions = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await loadUsersFromBackend(currentSearch, nextPage);
      
      // Merge with existing options and selected options
      const mergedOptions = mergOptionsWithSelected([...loadedOptions, ...result.users]);
      
      setLoadedOptions(mergedOptions);
      setHasMore(result.hasMore);
      setCurrentPage(nextPage);
      
      // Update the select component's options
      if (selectRef.current) {
        selectRef.current.setState({ 
          menuOptions: mergedOptions 
        });
      }
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };



  // Custom MenuList component with "Load More" button
  const CustomMenuList = (props: MenuListProps<UserOption, boolean, GroupBase<UserOption>>) => {
    return (
      <components.MenuList {...props}>
        {props.children}
        {hasMore && loadedOptions.length > 0 && (
          <div className="user-selector-load-more">
            <button
              type="button"
              className="load-more-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                loadMoreOptions();
              }}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Loading...
                </>
              ) : (
                <>
                  <i className="fas fa-chevron-down me-2"></i>
                  Load More ({loadedOptions.length} loaded)
                </>
              )}
            </button>
          </div>
        )}
      </components.MenuList>
    );
  };

  // Handle menu scroll to load more (alternative to button)
  const handleMenuScrollToBottom = () => {
    // Disabled in favor of Load More button for better UX
    // if (hasMore && !isLoadingMore) {
    //   loadMoreOptions();
    // }
  };

  // Get current selected options efficiently
  const getSelectedOptions = useCallback((): UserOption[] => {
    return Array.from(selectedOptionsMap.values());
  }, [selectedOptionsMap]);

  // Handle change and update selected options map
  const handleChange = useCallback((selected: MultiValue<UserOption> |  SingleValue<UserOption>) => {
    const selectedArray = Array.isArray(selected) ? selected : selected ? [selected] : [];
    
    // Update the map with selected options
    const newMap = new Map<number, UserOption>();
    selectedArray.forEach((option) => {
      newMap.set(option.value, option);
    });
    setSelectedOptionsMap(newMap);
    
    // Call parent onChange with IDs
    onChange(selectedArray.map((s) => s.value));
  }, [onChange]);

  return (
    <div className="user-selector">
      <label className="form-label">{label}</label>
      <AsyncSelect
        classNamePrefix="select-option"
        ref={selectRef}
        isMulti={isMulti}
        menuPortalTarget={document.body}
        name={name}
        cacheOptions
        defaultOptions
        formatOptionLabel={(option) => (
          <UserPreview 
            user={{
              id: option.value,
              name: option.name,
              email: option.email,
              profileImage: option.profileImage
            }}
            size="sm"
          />
        )}
        loadOptions={loadOptions}
        value={getSelectedOptions()}
        onChange={handleChange}
        placeholder={placeholder}
        styles={selectStyles}
        // isClearable
        // components={{ MenuList: CustomMenuList }}
        // onMenuScrollToBottom={handleMenuScrollToBottom}
        noOptionsMessage={({ inputValue }) => {
          if (inputValue && inputValue.length < 3) {
            return 'Type at least 3 characters to search...';
          }
          return 'No users found';
        }}
        loadingMessage={() => 'Loading users...'}
      />
    </div>
  );
};

export default UserSelector;
