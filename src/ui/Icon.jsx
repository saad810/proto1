import {
  AlertTriangle,
  AlignStartVertical,
  BuildingIcon,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
  Copy,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileIcon,
  FilePlus,
  FileQuestion,
  FileText,
  GraduationCapIcon,
  GripVertical,
  LogOut,
  MailIcon,
  MessageCircle,
  Play,
  PlayIcon,
  Plus,
  Save,
  SendIcon,
  Settings,
  Share2,
  Slash,
  StopCircle,
  Trash,
  Upload,
  UserPlus,
  Users,
  X,
  XCircle,
  XIcon,
  LayoutDashboard,  // New: Dashboard icon
  TestTubes        // New: Tests icon (using "TestTubes")
} from "lucide-react";

export const icons = {
  Share: Share2,
  Create: FilePlus,
  Add: Plus,
  Delete: Trash,
  Edit: Edit,
  Save: Save,
  Drag: GripVertical,
  Preview: Eye,
  Error: AlertTriangle,
  Logout: LogOut,
  Billing: CreditCard,
  Settings: Settings,
  Users: Users,
  Teachers: GraduationCapIcon,
  Start: Play,
  QuestionSet: FileText,
  Remove: X,
  Question: AlignStartVertical,
  Copy: Copy,
  Success: Check,
  Download: Download,
  End: StopCircle,
  Reactivate: PlayIcon,
  NotAnswered: Circle,
  Answered: CircleDot,
  Previous: ChevronLeft,
  Next: ChevronRight,
  Correct: CheckCircle,
  Wrong: XCircle,
  Empty: Slash,
  Reviewing: FileQuestion,
  Invite: UserPlus,
  Chat: MessageCircle,
  Close: XIcon,
  Send: SendIcon,
  Institution: BuildingIcon,
  Upload,
  File: FileIcon,
  Email: MailIcon,
  Dashboard: LayoutDashboard, // Added dashboard icon
  Tests: TestTubes            // Added tests icon
};

/**
 * @param {Object} props
 * @param {number} [props.size=16]
 * @param {keyof icons} props.name
 */
export function Icon({ size = 16, name, color }) {
  const IconElement = icons[name];
  return <IconElement color={color} size={size} />;
}
