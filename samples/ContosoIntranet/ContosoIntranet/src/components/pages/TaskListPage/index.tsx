// src/components/pages/TaskListPage/index.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeStyles, tokens } from '@fluentui/react-components';
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  Link,
  Text,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  Spinner,
  MessageBar,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Field,
  Textarea,
  Dropdown,
  Option,
  Toolbar,
  ToolbarButton,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';
import { 
  AddRegular,
  EditRegular,
  PersonRegular,
  FilterRegular,
  SearchRegular,
  ChevronDownRegular,
  MoreHorizontalRegular,
  DeleteRegular
} from '@fluentui/react-icons';
import { ContosoTasksService } from '../../../Services/ContosoTasksService';
import { ContosoTrendingService } from '../../../Services/ContosoTrendingService';
import { Office365UsersService } from '../../../Services/Office365UsersService';
import { getImageUrl } from '../../../utils/imageUtils';
import { fixPowerAppsResult } from '../../../utils/powerAppsResultFix';
import UserTagPicker from '../../common/UserTagPicker';
import type { ContosoTasks } from '../../../Models/ContosoTasksModel';
import type { ContosoTrending } from '../../../Models/ContosoTrendingModel';
import type { User } from '../../../Models/Office365UsersModel';

const useStyles = makeStyles({
  page: {
    backgroundColor: '#ffffff', // White background as per Figma
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '32px 48px', // Match HomePage padding
    gap: '32px',
    '@media (max-width: 1024px)': {
      padding: '24px',
      gap: '24px',
    },
    '@media (max-width: 768px)': {
      padding: '16px',
      gap: '16px',
    },
  },
  pageTitle: {
    fontSize: '32px', // Web/Title 1 from Figma 
    fontWeight: 600,
    lineHeight: '40px',
    color: '#323130', // NeutralForeground1.Rest
    margin: 0,
    fontFamily: '"Segoe UI", sans-serif',
  },
  pageSubtitle: {
    fontSize: '16px', // Web/Body 1 from Figma
    fontWeight: 400,
    lineHeight: '22px',
    color: '#605e5c', // NeutralForeground2.Rest
    margin: 0,
    maxWidth: '600px',
    fontFamily: '"Segoe UI", sans-serif',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '32px',
  },
  sectionTitleText: {
    fontSize: '20px', // Web/Title 4 from Figma
    fontWeight: 600,
    lineHeight: '24px',
    color: '#323130', // NeutralForeground1.Rest
    margin: 0,
    fontFamily: '"Segoe UI", sans-serif',
  },
  trendingCards: {
    display: 'flex',
    gap: '16px',
    '@media (max-width: 1024px)': {
      flexWrap: 'wrap',
      '& > *': {
        flex: '1 1 calc(50% - 8px)', // 2 cards per row on tablet
      },
    },
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '12px',
      '& > *': {
        flex: '1 1 auto', // Full width on mobile (vertical stack)
      },
    },
  },
  trendingCard: {
    flex: '1 1 0',
    minWidth: '250px',
    maxWidth: '400px',
    height: '320px', // Fixed height for all cards
    backgroundColor: '#ffffff',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    '@media (max-width: 1024px)': {
      flex: '1 1 calc(50% - 8px)',
      minWidth: 'calc(50% - 8px)',
      height: '300px', // Slightly smaller on tablets
    },
    '@media (max-width: 768px)': {
      flex: '1 1 auto',
      minWidth: '100%',
      height: '280px', // Even smaller on mobile
    },
  },
  cardImage: {
    width: '100%',
    height: '200px', // Fixed height to ensure consistent proportions
    objectFit: 'cover',
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderTopRightRadius: tokens.borderRadiusLarge,
    flexShrink: 0, // Prevent image from shrinking
    display: 'block', // Ensure proper image display
  },
  cardPreview: {
    overflow: 'hidden',
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderTopRightRadius: tokens.borderRadiusLarge,
    height: '220px', // Match image height
  },
  cardSubtitle: {
    color: tokens.colorNeutralForeground3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px', // Standard SharePoint toolbar height from Figma
    padding: '0 24px',
    backgroundColor: '#ffffff', // White background to match Figma Communication Site
    borderBottom: '1px solid #e1dfdd', // Only bottom border to separate from table
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      height: 'auto',
      gap: '12px',
      alignItems: 'stretch',
      padding: '16px',
    },
  },
  toolbarStart: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', // Increased gap for better spacing
    '@media (max-width: 768px)': {
      flexWrap: 'wrap',
      gap: '8px',
    },
  },
  toolbarEnd: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px', // Increased gap for better spacing
    '@media (max-width: 768px)': {
      justifyContent: 'flex-end',
    },
  },
  createTaskButton: {
    backgroundColor: '#03787c', // Exact brand color from Figma
    border: 'none',
    borderRadius: '4px',
    color: '#ffffff',
    fontFamily: '"Segoe UI", sans-serif',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    height: '32px',
    padding: '6px 16px',
    minWidth: '100px',
    '&:hover': {
      backgroundColor: '#026a6f', // Slightly darker on hover
    },
    '&:active': {
      backgroundColor: '#025357', // Even darker when pressed
    },
  },
  searchInput: {
    width: '240px', // Wider search input
    height: '32px',
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  toolbarButton: {
    height: '32px',
    minWidth: '32px',
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #e1dfdd', // NeutralStroke2.Rest
    borderRadius: '4px',
    color: '#323130', // NeutralForeground1.Rest
    fontFamily: '"Segoe UI", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    '&:hover': {
      backgroundColor: '#f3f2f1', // NeutralBackground1Hover
      border: '1px solid #d2d0ce', // NeutralStroke1Hover
    },
    '&:active': {
      backgroundColor: '#edebe9', // NeutralBackground1Pressed
    },
  },
  overflowMenu: {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  },
  toolbarActions: {
    display: 'flex',
    gap: '8px',
    '@media (max-width: 768px)': {
      display: 'none', // Hide individual actions on mobile, show in overflow menu
    },
  },
  // Unified container for toolbar and table
  tasksContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e1dfdd', // NeutralStroke2.Rest
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)', // Subtle shadow from Figma
    overflow: 'hidden', // Hide overflow for clean look
    resize: 'both', // Make entire container resizable
    minHeight: '500px', // Minimum height for container
    maxHeight: '85vh', // Maximum height
    minWidth: '700px', // Minimum width
    '@media (max-width: 768px)': {
      minWidth: '100%',
      resize: 'vertical', // Only vertical resize on mobile
      maxHeight: '75vh',
    },
  },
  dataGrid: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '0',
    overflow: 'auto',
    minHeight: '400px',
    maxHeight: '80vh',
    minWidth: '600px',
    tableLayout: 'fixed',
    '& th, & td': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      border: 'none', // Remove all borders
    },
    '& th': {
      position: 'relative',
      userSelect: 'none',
      '&:hover': {
        backgroundColor: tokens.colorNeutralBackground1Hover,
      },
    },
    '@media (max-width: 768px)': {
      fontSize: '12px',
      minWidth: '100%',
      '& th, & td': {
        whiteSpace: 'normal',
      },
      '& th::after': {
        display: 'none', // Hide resize handles on mobile
      },
    },
  },
  gridRow: {
    height: '44px',
    borderBottom: '1px solid #f3f2f1',
  },
  gridCell: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  resizeHandle: {
    position: 'absolute',
    right: '0',
    top: '0',
    bottom: '0',
    width: '8px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    zIndex: 10,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
      borderRight: `2px solid ${tokens.colorBrandForeground1}`,
    },
    '&:active': {
      backgroundColor: tokens.colorBrandBackground2Pressed,
      borderRight: `2px solid ${tokens.colorBrandForeground1}`,
    },
  },
  taskIcon: {
    width: '24px',
    height: '24px',
  },
  taskText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    color: '#323130', // NeutralForeground1.Rest
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: '"Segoe UI", sans-serif',
  },
  taskDescription: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    color: '#605e5c', // NeutralForeground2.Rest
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: '"Segoe UI", sans-serif',
  },
  assignedUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    color: '#323130', // NeutralForeground1.Rest
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontFamily: '"Segoe UI", sans-serif',
  },
});

interface TrendingCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  icon: string;
}

// Mock data removed - using live SharePoint data only

// Helper function to extract display name from SharePoint Person field
const getDisplayNameFromPersonField = (task: ContosoTasks): string => {
  // Try to get display name from AssignedTo object first
  if (task.AssignedTo && typeof task.AssignedTo === 'object') {
    const assignedTo = task.AssignedTo as any;
    if (assignedTo.displayName) return assignedTo.displayName;
    if (assignedTo.DisplayName) return assignedTo.DisplayName;
    if (assignedTo.Title) return assignedTo.Title;
  }
  
  // Fallback to Claims field, extract name part
  if (task["AssignedTo#Claims"]) {
    // Extract display name from claims format (remove domain/email parts)
    const claims = task["AssignedTo#Claims"];
    // Handle format like "i:0#.f|membership|user@domain.com" -> extract user part
    if (claims.includes('|')) {
      const parts = claims.split('|');
      const email = parts[parts.length - 1];
      // Extract name part from email or return email
      return email.split('@')[0].replace(/\./g, ' ').replace(/_/g, ' ');
    }
    return claims;
  }
  
  return 'Unassigned';
};

// Custom hooks for task data
function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const result = await ContosoTasksService.getAll();
      const fixedResult = fixPowerAppsResult<ContosoTasks[]>(result);
      if (!fixedResult.isSuccess) {
        throw new Error(fixedResult.error || 'Failed to fetch tasks');
      }
      const tasks = fixedResult.result || [];
      
      // Use SharePoint data as-is, no mock enhancement needed
      return tasks;
    },
    staleTime: 30000, // Cache for 30 seconds
  });
}

function useTaskMutations() {
  const queryClient = useQueryClient();
  
  const createTask = useMutation({
    mutationFn: async (newTask: Omit<ContosoTasks, 'ID'>) => {
      const result = await ContosoTasksService.create(newTask);
      const fixedResult = fixPowerAppsResult<ContosoTasks>(result);
      
      if (!fixedResult.isSuccess) {
        const errorMessage = typeof fixedResult.error === 'string' 
          ? fixedResult.error 
          : JSON.stringify(fixedResult.error) || 'Failed to create task';
        console.error('Create task failed:', errorMessage);
        throw new Error(errorMessage);
      }
      return fixedResult.result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<ContosoTasks, 'ID'>> }) => {
      try {
        const result = await ContosoTasksService.update(id, updates);
        
        const fixedResult = fixPowerAppsResult<ContosoTasks>(result);
        
        if (!fixedResult.isSuccess) {
          const errorMessage = typeof fixedResult.error === 'string' 
            ? fixedResult.error 
            : JSON.stringify(fixedResult.error) || 'Failed to update task';
          console.error('Update task failed:', errorMessage);
          throw new Error(errorMessage);
        }
        return fixedResult.result;
      } catch (error) {
        console.error('UpdateTask service call failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      try {
        // ContosoTasksService.delete returns Promise<void>, not IOperationResult
        await ContosoTasksService.delete(id);
      } catch (error) {
        console.error('ContosoTasksService.delete failed for ID:', id);
        console.error('Delete service error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { createTask, updateTask, deleteTask };
}

// Custom hook for trending data
function useTrending(maxItems = 4) {
  return useQuery({
    queryKey: ['trending', maxItems],
    queryFn: async () => {
      const result = await ContosoTrendingService.getAll({
        orderBy: ['TrendingScore desc'],
        top: maxItems
      });
      const fixedResult = fixPowerAppsResult<ContosoTrending[]>(result);
      if (!fixedResult.isSuccess) {
        console.warn('Error loading trending data from SharePoint:', fixedResult.error);
        return [];
      }
      return fixedResult.result || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Helper function to convert ContosoTrending to TrendingCard
function convertToTrendingCards(contosoTrending: ContosoTrending[]): TrendingCard[] {
  return contosoTrending.map((item, index) => ({
    id: item.ID?.toString() || index.toString(),
    title: item.Title || '',
    subtitle: `Trending score: ${item.TrendingScore || 0}`,
    imageUrl: item.ImageUrl || getImageUrl(undefined, '/assets/images/App Designed for Collaboration.png'),
    icon: 'document' // Default icon
  }));
}

// Simplified Claims-only validation function

const validateAndPrepareAssignedToField = async (selectedUsers: User[]): Promise<{
  personField: Record<string, unknown> | Record<string, unknown>[] | null;
  validated: boolean;
  userInfo?: { displayName: string; email: string; };
}> => {
  if (selectedUsers.length === 0) {
    return { personField: null, validated: true };
  }

  const selectedUser = selectedUsers[0];
  const email = selectedUser.Mail || selectedUser.UserPrincipalName;
  
  if (!email) {
    console.warn('Selected user has no email address');
    return { personField: null, validated: false };
  }

  try {
    const searchResult = await Office365UsersService.SearchUserV2(email, 10, true);
    const fixedResult = fixPowerAppsResult(searchResult);
    
    if (fixedResult.isSuccess && fixedResult.result?.value && fixedResult.result.value.length > 0) {
      const validatedUser = fixedResult.result.value.find((user: User) => 
        (user.Mail && user.Mail.toLowerCase() === email.toLowerCase()) ||
        (user.UserPrincipalName && user.UserPrincipalName.toLowerCase() === email.toLowerCase())
      ) || fixedResult.result.value[0];
      
      // Create SharePoint-compatible Person field object matching the payload format
      const personField = [{
        "Key": `i:0#.f|membership|${validatedUser.Mail || validatedUser.UserPrincipalName}`,
        "DisplayText": validatedUser.DisplayName || 'Unknown User',
        "IsResolved": true,
        "Description": validatedUser.Mail || validatedUser.UserPrincipalName,
        "EntityType": "User",
        "EntityData": {
          "IsAltSecIdPresent": false,
          "UserKey": `i:0h.f|membership|${validatedUser.UserPrincipalName}`,
          "Title": null,
          "Email": validatedUser.Mail || validatedUser.UserPrincipalName,
          "MobilePhone": null,
          "ObjectId": validatedUser.Id,
          "Department": validatedUser.Department || null
        },
        "MultipleMatches": [],
        "ProviderName": "Tenant",
        "ProviderDisplayName": "Tenant"
      }];
      
      return {
        personField,
        validated: true,
        userInfo: {
          displayName: validatedUser.DisplayName || 'Unknown User',
          email: validatedUser.Mail || validatedUser.UserPrincipalName || email
        }
      };
    } else {
      console.warn('❌ Selected user could not be validated in Azure AD');
      return { personField: null, validated: false };
    }
  } catch (error) {
    console.error('❌ Error validating user:', error);
    return { personField: null, validated: false };
  }
};

export default function TaskListPage() {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskDialogMode, setTaskDialogMode] = useState<'create' | 'edit'>('create');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<ContosoTasks | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Not Started'
  });
  const [assignData, setAssignData] = useState<{
    assignedTo: User[]
  }>({
    assignedTo: []
  });

  // Column widths for resizable table (state-based)
  const [columnWidths, setColumnWidths] = useState({
    task: 40,
    assignedTo: 25, 
    taskType: 20,
    notes: 15
  });

  // Column resizing functionality
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidths, setStartWidths] = useState<typeof columnWidths>({ task: 40, assignedTo: 25, taskType: 20, notes: 15 });
  const tableRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(columnKey);
    setStartX(e.clientX);
    setStartWidths({ ...columnWidths });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing || !tableRef.current) return;
    
    const tableBounds = tableRef.current.getBoundingClientRect();
    const diff = e.clientX - startX;
    const tableWidth = tableBounds.width;
    const pixelToPercentage = (diff / tableWidth) * 100;
    
    const newWidth = Math.max(10, Math.min(60, startWidths[isResizing as keyof typeof startWidths] + pixelToPercentage));
    
    setColumnWidths(prev => ({
      ...prev,
      [isResizing]: newWidth
    }));
  }, [isResizing, startX, startWidths]);

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(null);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);
  
  // SharePoint data hooks
  const { data: tasks = [], isLoading, error } = useTasks();
  const { data: sharePointTrending = [], error: trendingError } = useTrending();
  const { createTask, updateTask, deleteTask } = useTaskMutations();

  // Use SharePoint trending data only (limit to 4 items)
  const trendingToDisplay = convertToTrendingCards(sharePointTrending).slice(0, 4);

  if (trendingError) {
    console.warn('Error loading trending data from SharePoint:', trendingError);
  }

  // Filter tasks based on search and filter criteria
  const filteredTasks = React.useMemo(() => {
    let result = tasks;
    
    // Apply search filter
    if (searchTerm.trim()) {
      result = result.filter((task: ContosoTasks) => 
        task.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply priority filter
    if (filterBy !== 'all') {
      const priorityId = filterBy === 'high' ? 1 : filterBy === 'medium' ? 2 : 3;
      result = result.filter((task: ContosoTasks) => task["Priority#Id"] === priorityId);
    }
    
    return result;
  }, [tasks, searchTerm, filterBy]);

  // Selection handlers
  const handleTaskSelect = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(taskId);
      } else {
        newSelection.delete(taskId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allTaskIds = filteredTasks.map((task: ContosoTasks) => task.ID?.toString() || '').filter(Boolean);
      setSelectedTasks(new Set(allTaskIds));
    } else {
      setSelectedTasks(new Set());
    }
  };

  const isAllSelected = filteredTasks.length > 0 && filteredTasks.every((task: ContosoTasks) => 
    selectedTasks.has(task.ID?.toString() || '')
  );

  if (error) {
    return (
      <div className={styles.page}>
        <MessageBar intent="error">
          Failed to load tasks: {error instanceof Error ? error.message : 'Unknown error'}
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Title */}
      <div className={styles.section}>
        <h1 className={styles.pageTitle}>Welcome to Van Arsdel, Elvia</h1>
        <p className={styles.pageSubtitle}>
          Let's get creative with Van Arsdel to organize your content.
        </p>
      </div>

      {/* Trending Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.sectionTitleText}>Trending in your org</h2>
          <Link href="#" appearance="subtle">
            See more
          </Link>
        </div>
        <div className={styles.trendingCards}>
          {trendingToDisplay.map((card) => (
            <Card key={card.id} className={styles.trendingCard}>
              <CardPreview className={styles.cardPreview}>
                <img 
                  src={card.imageUrl} 
                  alt={card.title}
                  className={styles.cardImage}
                />
              </CardPreview>
              <CardHeader
                header={<Text weight="semibold">{card.title}</Text>}
                description={
                  <Caption1 className={styles.cardSubtitle}>{card.subtitle}</Caption1>
                }
                action={
                  <Button
                    appearance="transparent"
                    icon={<MoreHorizontalRegular />}
                    size="small"
                    aria-label="More actions"
                  />
                }
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Combined Toolbar and Tasks Section */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <h2 className={styles.sectionTitleText}>All tasks</h2>
        </div>
        
        <div className={styles.tasksContainer}>
          {/* Toolbar */}
          <Toolbar aria-label="Task management toolbar" className={styles.toolbar}>
            <div className={styles.toolbarStart}>
              <ToolbarButton
                appearance="primary"
                icon={<AddRegular />}
                onClick={() => {
                  setTaskDialogMode('create');
                  setFormData({ title: '', description: '', priority: 'Medium', status: 'Not Started' });
                  setEditingTask(null);
                  setIsTaskDialogOpen(true);
                }}
              >
                New
              </ToolbarButton>
              <ToolbarButton
                appearance="transparent"
                icon={<EditRegular />}
                disabled={selectedTasks.size !== 1}
                onClick={() => {
                  const selectedTaskIds = Array.from(selectedTasks);
                  const taskToEdit = filteredTasks.find((task: ContosoTasks) => task.ID === parseInt(selectedTaskIds[0]));
                  if (taskToEdit) {
                    setEditingTask(taskToEdit);
                    setFormData({
                      title: taskToEdit.Title || '',
                      description: taskToEdit.Description || '',
                      priority: typeof taskToEdit.Priority === 'string' ? taskToEdit.Priority : 'Medium',
                      status: typeof taskToEdit.Status === 'string' ? taskToEdit.Status : 'Not Started'
                    });
                    // Parse existing assignedTo data for edit mode
                    let existingAssignedUsers: User[] = [];
                    if (taskToEdit.AssignedTo && typeof taskToEdit.AssignedTo === 'object') {
                      const assignedTo = taskToEdit.AssignedTo as any;
                      if (assignedTo.UserIds && Array.isArray(assignedTo.UserIds)) {
                        // Real user data - we'd need to fetch user details by IDs
                        // For now, create mock User objects from the saved data
                        const displayNames = assignedTo.DisplayName ? assignedTo.DisplayName.split(', ') : [];
                        existingAssignedUsers = assignedTo.UserIds.map((id: string, index: number) => ({
                          Id: id,
                          DisplayName: displayNames[index] || `User ${index + 1}`,
                          Mail: `user${index + 1}@contoso.com` // Mock email
                        }));
                      }
                    }
                    setAssignData({ assignedTo: existingAssignedUsers });
                    setTaskDialogMode('edit');
                    setIsTaskDialogOpen(true);
                  }
                }}
              >
                Edit
              </ToolbarButton>
              <ToolbarButton
                appearance="transparent"
                icon={<PersonRegular />}
                disabled={selectedTasks.size === 0}
                onClick={() => {
                  setIsAssignDialogOpen(true);
                }}
              >
                Assign
              </ToolbarButton>
              <ToolbarButton
                appearance="transparent"
                icon={<DeleteRegular />}
                disabled={selectedTasks.size === 0}
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </ToolbarButton>
            </div>
            <div className={styles.toolbarEnd}>
              <Input
                className={styles.searchInput}
                placeholder="Find"
                contentBefore={<SearchRegular />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Menu positioning={{ autoSize: true }}>
                <MenuTrigger disableButtonEnhancement>
                  <ToolbarButton
                    appearance="subtle"
                    icon={<FilterRegular />}
                  />
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem 
                      onClick={() => setFilterBy('all')}
                      style={{ 
                        backgroundColor: filterBy === 'all' ? tokens.colorNeutralBackground1Selected : 'transparent' 
                      }}
                    >
                      All Tasks
                    </MenuItem>
                    <MenuItem 
                      onClick={() => setFilterBy('high')}
                      style={{ 
                        backgroundColor: filterBy === 'high' ? tokens.colorNeutralBackground1Selected : 'transparent' 
                      }}
                    >
                      High Priority
                    </MenuItem>
                    <MenuItem 
                      onClick={() => setFilterBy('medium')}
                      style={{ 
                        backgroundColor: filterBy === 'medium' ? tokens.colorNeutralBackground1Selected : 'transparent' 
                      }}
                    >
                      Medium Priority
                    </MenuItem>
                    <MenuItem 
                      onClick={() => setFilterBy('low')}
                      style={{ 
                        backgroundColor: filterBy === 'low' ? tokens.colorNeutralBackground1Selected : 'transparent' 
                      }}
                    >
                      Low Priority
                    </MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
          </Toolbar>

          {/* Task Table */}
          <div ref={tableRef}>
            <Table className={styles.dataGrid} size="small">
          <TableHeader>
            <TableRow className={styles.gridRow}>
              <TableHeaderCell style={{ width: `${columnWidths.task}%`, position: 'relative' }}>
                <div className={styles.gridCell}>
                  <Checkbox 
                    checked={isAllSelected}
                    onChange={(_, data) => handleSelectAll(Boolean(data.checked))}
                  />
                  <Text>Task</Text>
                  <ChevronDownRegular />
                </div>
                <div 
                  className={styles.resizeHandle}
                  onMouseDown={(e) => handleMouseDown(e, 'task')}
                />
              </TableHeaderCell>
              <TableHeaderCell style={{ width: `${columnWidths.assignedTo}%`, position: 'relative' }}>
                <div className={styles.gridCell}>
                  <Text>Assigned to</Text>
                </div>
                <div 
                  className={styles.resizeHandle}
                  onMouseDown={(e) => handleMouseDown(e, 'assignedTo')}
                />
              </TableHeaderCell>
              <TableHeaderCell style={{ width: `${columnWidths.taskType}%`, position: 'relative' }}>
                <div className={styles.gridCell}>
                  <Text>Task type</Text>
                </div>
                <div 
                  className={styles.resizeHandle}
                  onMouseDown={(e) => handleMouseDown(e, 'taskType')}
                />
              </TableHeaderCell>
              <TableHeaderCell style={{ width: `${columnWidths.notes}%`, position: 'relative' }}>
                <div className={styles.gridCell}>
                  <Text>Notes</Text>
                </div>
                {/* No resize handle on last column */}
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow className={styles.gridRow}>
                <TableCell colSpan={4}>
                  <div className={styles.gridCell}>
                    <Spinner size="small" />
                    <Text>Loading tasks...</Text>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredTasks.map((task: ContosoTasks) => {
              const isCompleted = task.OData__ColorTag === 'Completed';
              const dueDate = task.DueDate ? new Date(task.DueDate) : null;
              const isOverdue = dueDate && dueDate < new Date() && !isCompleted;
              const taskId = task.ID?.toString() || '';
              const isSelected = selectedTasks.has(taskId);
              
              return (
                <TableRow key={task.ID} className={styles.gridRow}>
                  <TableCell style={{ width: `${columnWidths.task}%` }}>
                    <div className={styles.gridCell}>
                      <Checkbox 
                        checked={isSelected}
                        onChange={(_, data) => handleTaskSelect(taskId, Boolean(data.checked))}
                      />
                      <div className={styles.taskIcon}>
                        {/* Icon placeholder */}
                      </div>
                      <div className={styles.taskText}>
                        <h4 className={styles.taskTitle}>{task.Title}</h4>
                        <p className={styles.taskDescription}>
                          {task.Description || 'No description'}
                          {isOverdue && ' (Overdue)'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={{ width: `${columnWidths.assignedTo}%` }}>
                    <div className={styles.gridCell}>
                      <div className={styles.assignedUser}>
                        <Avatar
                          name={getDisplayNameFromPersonField(task)}
                          size={32}
                        />
                        <p className={styles.userName}>
                          {getDisplayNameFromPersonField(task)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={{ width: `${columnWidths.taskType}%` }}>
                    <div className={styles.gridCell}>
                      <p className={styles.userName}>
                        {task["Priority#Id"] === 1 ? 'High' : 
                         task["Priority#Id"] === 2 ? 'Medium' : 
                         task["Priority#Id"] === 3 ? 'Low' : 'Normal'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell style={{ width: `${columnWidths.notes}%` }}>
                    <div className={styles.gridCell}>
                      <p className={styles.userName}>
                        {dueDate ? dueDate.toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {!isLoading && filteredTasks.length === 0 && (
              <TableRow className={styles.gridRow}>
                <TableCell colSpan={4}>
                  <div className={styles.gridCell}>
                    <Text>No tasks found</Text>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
          </div>
        </div>
      </div>

      {/* Unified Task Dialog (Create/Edit) */}
      <Dialog open={isTaskDialogOpen} onOpenChange={(_, data) => setIsTaskDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{taskDialogMode === 'create' ? 'Create New Task' : 'Edit Task'}</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Title" required>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </Field>
                
                <Field label="Description">
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </Field>
                
                <Field label="Priority">
                  <Dropdown
                    value={formData.priority}
                    onOptionSelect={(_, data) => setFormData({ ...formData, priority: data.optionValue || 'Medium' })}
                  >
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Dropdown>
                </Field>
                
                <Field label="Status">
                  <Dropdown
                    value={formData.status}
                    onOptionSelect={(_, data) => setFormData({ ...formData, status: data.optionValue || 'Not Started' })}
                  >
                    <Option value="Not Started">Not Started</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Completed">Completed</Option>
                  </Dropdown>
                </Field>
                
                <UserTagPicker
                  label="Assigned To"
                  selectedUsers={assignData.assignedTo}
                  onSelectionChange={(users) => setAssignData({ assignedTo: users })}
                  placeholder="Search for person to assign..."
                  maxSelectedUsers={1}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button 
                appearance="secondary" 
                onClick={() => {
                  setIsTaskDialogOpen(false);
                  setFormData({ title: '', description: '', priority: 'Medium', status: 'Not Started' });
                  setAssignData({ assignedTo: [] });
                  setEditingTask(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                appearance="primary"
                style={{ backgroundColor: '#03787c', color: '#ffffff' }}
                onClick={async () => {
                  if (formData.title.trim()) {
                    try {
                      if (taskDialogMode === 'create') {
                        // Validate and prepare AssignedTo field with Azure AD lookup
                        const assignedToData = await validateAndPrepareAssignedToField(assignData.assignedTo);

                        // Validate user if assignment was attempted
                        if (assignData.assignedTo.length > 0 && !assignedToData.validated) {
                          console.error('User validation failed - cannot create task');
                          throw new Error(`User could not be validated. Please select a different user or try again.`);
                        }

                        // Build task data with SharePoint-compatible Person field format
                        const taskData: any = {
                          Title: formData.title,
                          Description: formData.description,
                          // Use standard AssignedTo field with SharePoint Person field array
                          ...(assignedToData.personField && {
                            "AssignedTo": assignedToData.personField
                          })
                        };
                        
                        try {
                          await createTask.mutateAsync(taskData as Omit<ContosoTasks, 'ID'>);
                          
                        } catch (error) {
                          console.error('Task creation failed:', error);
                          throw error;
                        }
                      } else {
                        // Edit mode - update existing task
                        
                        if (!editingTask?.ID) {
                          throw new Error('No task ID found for edit operation');
                        }

                        // Validate and prepare AssignedTo field for update
                        const assignedToData = await validateAndPrepareAssignedToField(assignData.assignedTo);

                        // Validate user if assignment was attempted
                        if (assignData.assignedTo.length > 0 && !assignedToData.validated) {
                          console.error('User validation failed - cannot update task');
                          throw new Error(`User could not be validated. Please select a different user or try again.`);
                        }

                        // Build update data with SharePoint-compatible Person field format
                        const updateData: any = {
                          Title: formData.title,
                          Description: formData.description,
                          // Use standard AssignedTo field with SharePoint Person field array
                          ...(assignedToData.personField 
                            ? { "AssignedTo": assignedToData.personField }
                            : { "AssignedTo": null } // Clear assignment
                          )
                        };
                        
                        try {
                          await updateTask.mutateAsync({ 
                            id: editingTask.ID!.toString(), 
                            updates: updateData 
                          });
                          
                        } catch (error) {
                          console.error('Task update failed:', error);
                          
                          // Fallback: Try with simple email format if user validation passed
                          if (assignedToData) {

                            const fallbackUpdateData: any = {
                              Title: formData.title,
                              Description: formData.description,
                              AssignedTo: assignedToData.userInfo?.email || '' // Extract just the email
                            };
                            
                            try {
                              await updateTask.mutateAsync({ 
                                id: editingTask.ID!.toString(), 
                                updates: fallbackUpdateData 
                              });
                            } catch (fallbackError) {
                              console.error('Even fallback update failed:', fallbackError);
                              throw fallbackError;
                            }
                          } else {
                            throw error;
                          }
                        }
                      }
                      setIsTaskDialogOpen(false);
                      setFormData({ title: '', description: '', priority: 'Medium', status: 'Not Started' });
                      setAssignData({ assignedTo: [] });
                      setEditingTask(null);
                    } catch (error) {
                      console.error('Failed to save task:', JSON.stringify(error));
                    }
                  }
                }}
                disabled={!formData.title.trim() || createTask.isPending}
              >
                {createTask.isPending 
                  ? (taskDialogMode === 'create' ? 'Creating...' : 'Updating...') 
                  : (taskDialogMode === 'create' ? 'Create Task' : 'Update Task')
                }
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      {/* Assign Task Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={(_, data) => setIsAssignDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Text>
                  Assign {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''} to:
                </Text>
                <UserTagPicker
                  label="Assigned To"
                  selectedUsers={assignData.assignedTo}
                  onSelectionChange={(users) => setAssignData({ assignedTo: users })}
                  placeholder="Search for person to assign..."
                  maxSelectedUsers={1}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                appearance="primary"
                style={{ backgroundColor: '#03787c', color: '#ffffff' }}
                onClick={async () => {
                  if (assignData.assignedTo.length > 0) {
                    try {
                      // Validate and prepare AssignedTo field
                      const assignedToData = await validateAndPrepareAssignedToField(assignData.assignedTo);
                      
                      if (!assignedToData.validated || !assignedToData.personField) {
                        throw new Error('Failed to validate selected user');
                      }

                      const taskIds = Array.from(selectedTasks);

                      // For each selected task, update with SharePoint Person field array  
                      for (const taskId of taskIds) {
                        const updateData = {
                          "AssignedTo": assignedToData.personField as Record<string, unknown>
                        };
                        
                        try {
                          await updateTask.mutateAsync({ 
                            id: taskId, 
                            updates: updateData 
                          });
                        } catch (error) {
                          console.error(`Failed to assign task ${taskId}:`, error);
                          throw error;
                        }
                      }
                      
                      setIsAssignDialogOpen(false);
                      setAssignData({ assignedTo: [] });
                      setSelectedTasks(new Set());
                    } catch (error) {
                      console.error('❌ Failed to assign tasks:', error);
                      // Could show user-friendly error message here
                    }
                  }
                }}
                disabled={assignData.assignedTo.length === 0}
              >
                Assign
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Delete Task Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(_, data) => setIsDeleteDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete Task{selectedTasks.size > 1 ? 's' : ''}</DialogTitle>
            <DialogContent>
              <Text>
                Are you sure you want to delete {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''}? 
                This action cannot be undone.
              </Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                appearance="primary"
                style={{ backgroundColor: '#d13438', color: '#ffffff' }}
                onClick={async () => {
                  try {
                    const taskIds = Array.from(selectedTasks);
                    
                    // Delete each task individually
                    for (const taskId of taskIds) {
                      await deleteTask.mutateAsync(taskId);
                    }
                    
                    setIsDeleteDialogOpen(false);
                    setSelectedTasks(new Set());
                  } catch (error) {
                    console.error('Failed to delete tasks:');
                    console.error('Error object:', error);
                    console.error('Error message:', (error as any)?.message);
                    console.error('Error stack:', (error as any)?.stack);
                    console.error('Full error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                  }
                }}
                disabled={deleteTask.isPending}
              >
                {deleteTask.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
