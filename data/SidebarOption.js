import { BsCurrencyDollar } from "react-icons/bs";
import {
  MdFormatListBulleted,
  MdListAlt,
  MdOutlineGroup,
  MdOutlineManageAccounts,
  MdOutlineMarkunread,
  MdOutlinePoll,
  MdPersonOutline,
} from "react-icons/md";
import {
  RiDashboardLine,
  RiHospitalLine,
  RiStethoscopeLine,
} from "react-icons/ri";
import { IconBale } from "../assets/Icons";
export const AdminAccess = [
  {
    id: 0,
    label: "داشبورد",
    icon: <RiDashboardLine />,
    value: "doctor",
    link: "/admin",
    child: [],
  },
  {
    id: 1,
    label: "بیماران",
    icon: <MdOutlineGroup />,
    value: "",

    child: [
      {
        id: 0,
        label: "تشکیل پرونده",
        value: "add",

        link: "/admin/record/add",
      },
      { id: 1, label: "پرونده بیماران", value: "add", link: "/admin/record" },
      {
        id: 2,
        label: "نوبت دهی ",

        value: "add",
        link: "/admin/appointment",
      },
      {
        id: 3,
        label: "ثبت نوبت دهی ویژه",
        value: "add",

        link: "/admin/vip-appointment",
      },
      {
        id: 4,
        label: "درمان های ثبت نشده",
        value: "add",

        link: "/admin/record/unregistered-treatments",
      },
      {
        id: 5,
        label: "پرونده های مطب",
        value: "add",

        link: "/admin/record/clinic",
      },
      {
        id: 6,
        label: "انتقال بیمار",
        value: "add",
        link: "/admin/transfer/",
      },
    ],
  },
  {
    id: 2,
    label: "پزشکان",
    icon: (
      <div className="relative text-xl w-5 h-5">
        <MdPersonOutline />
        <div className="text-xs absolute -right-1 top-0 block">
          <RiStethoscopeLine />
        </div>
      </div>
    ),
    value: "doctor",
    child: [
      { id: 0, label: "پزشکان", value: "add", link: "/admin/doctor" },
      // {
      //   id: 1,
      //   label: "تقویم نوبت های پزشک",
      //   value: "add",
      //   link: "#",
      // },
    ],
  },
  {
    id: 3,
    label: "امکانات",
    icon: <MdFormatListBulleted />,
    value: "",
    child: [
      {
        id: 1,
        label: "لیست شماره های من",
        value: "add",
        link: "/admin/phone-numbers/me",
      },
      {
        id: 0,
        label: "لیست شماره تلفن ها",
        value: "add",
        link: "/admin/phone-numbers",
      },
      {
        id: 2,
        label: "درمان های معلق",
        value: "add",
        link: "/admin/fix",
      },
    ],
  },
  {
    id: 4,
    label: "حسابداری",
    icon: <BsCurrencyDollar />,
    value: "",
    child: [
      {
        id: 0,
        label: "مدیریت چک ها",
        value: "add",
        link: "/admin/finance/checks",
      },
      {
        id: 1,
        label: "عودت ها",
        value: "add",
        link: "/admin/finance/rollback",
      },
      {
        id: 2,
        label: "گزارشات مالی مطب",
        value: "add",
        link: "/admin/finance",
      },
    ],
  },
  {
    id: 5,
    label: "پاراکلینیک",
    icon: <RiHospitalLine />,
    value: "clinic",

    child: [
      {
        id: 0,
        label: "پاراکلینیک ها",
        value: "add",
        link: "/admin/paraclinic",
      },
      // {
      //   id: 1,
      //   label: "مدیریت نوع پاراکلینیک",
      //   value: "add",
      //   link: "/admin/paraclinic/manage",
      // },
    ],
  },
  // {
  //   id: 6,
  //   label: "گزارشات",
  //   icon: <MdOutlinePoll />,
  //   value: "",
  //   child: [],
  // },
  {
    id: 9,
    label: "اطلاعات پایه",
    icon: <MdListAlt />,
    value: "doctor",

    child: [
      {
        id: 0,
        label: "خدمات",
        value: "add",
        link: "/admin/service",
      },
      {
        id: 1,
        label: "مطب ها",
        value: "add",
        link: "/admin/clinic",
      },
      // {
      //   id: 2,
      //   label: "برند ایمپلنت",
      //   value: "add",
      //   link: "/admin/implant",
      // },
      {
        id: 3,
        label: "وضعیت های بیمار",
        value: "add",
        link: "/admin/patient-status",
      },
      {
        id: 4,
        label: "مدیریت بیماری های سیستمیک",
        value: "add",
        link: "/admin/diseases",
      },
    ],
  },
  {
    id: 10,
    label: "پیام رسان بله",
    icon: <MdOutlineManageAccounts />,
    value: "",

    child: [
      {
        id: 0,
        label: "گفتگو ها",
        value: "add",
        link: "/admin/bale/conversation",
      },
    ],
  },
  {
    id: 7,
    label: "مدیریت پیامک ها ",
    icon: <MdOutlineMarkunread />,
    value: "",
    child: [
      {
        id: 1,
        label: "گفت و گو ها",
        value: "add",
        link: "/admin/message/conversation",
      },
      {
        id: 0,
        label: "ارسال پیامک ",
        value: "add",
        link: "/admin/message",
      },
    ],
  },

  // {
  //   id: 10,
  //   label: "پروفایل کاربری",
  //   icon: <MdPersonOutline />,
  //   value: "",
  //   child: [
  //     // {
  //     //   id: 0,
  //     //   label: "نمایش پروفایل",
  //     //   value: "add",
  //     //   link: "",
  //     // },
  //     {
  //       id: 0,
  //       label: "تغییر رمز عبور",
  //       value: "add",
  //       link: "",
  //     },
  //     // {
  //     //   id: 0,
  //     //   label: "شکایات-انتقادات-پیشنهادات",
  //     //   value: "add",
  //     //   link: "",
  //     // },
  //   ],
  // },
];
export const SuperAdminAccess = [
  {
    id: 0,
    label: "داشبورد",
    icon: <RiDashboardLine />,
    value: "doctor",
    link: "/admin",
    child: [],
  },
  {
    id: 1,
    label: "بیماران",
    icon: <MdOutlineGroup />,
    value: "",

    child: [
      {
        id: 0,
        label: "تشکیل پرونده",
        value: "add",

        link: "/admin/record/add",
      },
      { id: 1, label: "پرونده بیماران", value: "add", link: "/admin/record" },
      {
        id: 2,
        label: "نوبت دهی ",

        value: "add",
        link: "/admin/appointment",
      },
      {
        id: 3,
        label: "ثبت نوبت دهی ویژه",
        value: "add",

        link: "/admin/vip-appointment",
      },
      {
        id: 4,
        label: "انتقال بیمار",
        value: "add",
        link: "/admin/transfer/",
      },
      {
        id: 5,
        label: "درمان های ثبت نشده",
        value: "add",

        link: "/admin/record/unregistered-treatments",
      },
      {
        id: 6,
        label: "پرونده های مطب",
        value: "add",

        link: "/admin/record/clinic",
      },
    ],
  },
  {
    id: 2,
    label: "پزشکان",
    icon: (
      <div className="relative text-xl w-5 h-5">
        <MdPersonOutline />
        <div className="text-xs absolute -right-1 top-0 block">
          <RiStethoscopeLine />
        </div>
      </div>
    ),
    value: "doctor",
    child: [
      { id: 0, label: "پزشکان", value: "add", link: "/admin/doctor" },
      // {
      //   id: 1,
      //   label: "تقویم نوبت های پزشک",
      //   value: "add",
      //   link: "#",
      // },
    ],
  },
  {
    id: 3,
    label: "امکانات",
    icon: <MdFormatListBulleted />,
    value: "",
    child: [
      {
        id: 1,
        label: "لیست شماره های من",
        value: "add",
        link: "/admin/phone-numbers/me",
      },
      {
        id: 0,
        label: "لیست شماره تلفن ها",
        value: "add",
        link: "/admin/phone-numbers",
      },
      {
        id: 2,
        label: "درمان های معلق",
        value: "add",
        link: "/admin/fix",
      },
    ],
  },
  {
    id: 4,
    label: "حسابداری",
    icon: <BsCurrencyDollar />,
    value: "",
    child: [
      {
        id: 0,
        label: "مدیریت چک ها",
        value: "add",
        link: "/admin/finance/checks",
      },
      {
        id: 1,
        label: "عودت ها",
        value: "add",
        link: "/admin/finance/rollback",
      },
      {
        id: 2,
        label: "گزارشات مالی مطب",
        value: "add",
        link: "/admin/finance",
      },
      {
        id: 4,
        label: "چک های داخلی",
        value: "add",
        link: "/admin/finance/internal-checks",
      },
      {
        id: 5,
        label: "پرداختی بیماران",
        value: "add",
        link: "/admin/finance/patients-payments",
      },
    ],
  },
  {
    id: 5,
    label: "پاراکلینیک",
    icon: <RiHospitalLine />,
    value: "clinic",

    child: [
      {
        id: 0,
        label: "پاراکلینیک ها",
        value: "add",
        link: "/admin/paraclinic",
      },
      // {
      //   id: 1,
      //   label: "مدیریت نوع پاراکلینیک",
      //   value: "add",
      //   link: "/admin/paraclinic/manage",
      // },
    ],
  },
  {
    id: 6,
    label: "گزارشات",
    icon: <MdOutlinePoll />,
    value: "",
    child: [
      {
        id: 0,
        label: "گزارشات کاربران",
        value: "add",
        link: "/admin/report",
      },
      {
        id: 1,
        label: "گزارشات مطب",
        value: "add",
        link: "/admin/report/clinic",
      },
      {
        id: 1,
        label: "گزارشات پیگیری",
        value: "add",
        link: "/admin/report/event",
      },
    ],
  },
  {
    id: 9,
    label: "اطلاعات پایه",
    icon: <MdListAlt />,
    value: "doctor",

    child: [
      {
        id: 0,
        label: "خدمات",
        value: "add",
        link: "/admin/service",
      },
      {
        id: 1,
        label: "مطب ها",
        value: "add",
        link: "/admin/clinic",
      },
      // {
      //   id: 2,
      //   label: "برند ایمپلنت",
      //   value: "add",
      //   link: "/admin/implant",
      // },
      {
        id: 3,
        label: "وضعیت های بیمار",
        value: "add",

        link: "/admin/patient-status",
      },
      {
        id: 4,
        label: "مدیریت بیماری های سیستمیک",
        value: "add",

        link: "/admin/diseases",
      },
    ],
  },
  {
    id: 10,
    label: "پیام رسان بله",
    icon: 'bale',
    value: "",

    child: [
      {
        id: 0,
        label: "گفتگو ها",
        value: "add",
        link: "/admin/bale/conversation",
      },
      {
        id: 1,
        label: "درخواست ها",
        value: "add",
        link: "/admin/bale/requests",
      },
      {
        id: 2,
        label: "گزارشات",
        value: "add",
        link: "/admin/bale/reports",
      },
    ],
  },
  {
    id: 7,
    label: "مدیریت پیامک ها ",
    icon: <MdOutlineMarkunread />,
    value: "",

    child: [
      {
        id: 1,
        label: "گفت و گو ها",
        value: "add",

        link: "/admin/message/conversation",
      },
      {
        id: 0,
        label: "ارسال پیامک ",
        value: "add",

        link: "/admin/message",
      },
    ],
  },
  {
    id: 8,
    label: "مدیریت کاربران",
    icon: <MdOutlineManageAccounts />,
    value: "",

    child: [
      {
        id: 0,
        label: "کاربران",
        value: "add",
        link: "/admin/users/",
      },
    ],
  },

  // {
  //   id: 10,
  //   label: "پروفایل کاربری",
  //   icon: <MdPersonOutline />,
  //   value: "",
  //   child: [
  //     // {
  //     //   id: 0,
  //     //   label: "نمایش پروفایل",
  //     //   value: "add",
  //     //   link: "",
  //     // },
  //     {
  //       id: 0,
  //       label: "تغییر رمز عبور",
  //       value: "add",
  //       link: "",
  //     },
  //     // {
  //     //   id: 0,
  //     //   label: "شکایات-انتقادات-پیشنهادات",
  //     //   value: "add",
  //     //   link: "",
  //     // },
  //   ],
  // },
];
export const OperatorAccess = [
  {
    id: 0,
    label: "داشبورد",
    icon: <RiDashboardLine />,
    value: "",
    link: "/operator",
    child: [],
  },
  {
    id: 1,
    label: "بیماران",
    icon: <MdOutlineGroup />,
    value: "",
    child: [
      {
        id: 0,
        label: "تشکیل پرونده",
        value: "add",
        link: "/operator/record/add",
      },
      {
        id: 1,
        label: "پرونده بیماران",
        value: "add",
        link: "/operator/record",
      },
      {
        id: 2,
        label: "نوبت دهی ",
        value: "add",
        link: "/operator/appointment",
      },
      {
        id: 3,
        label: "انتقال بیمار",
        value: "add",
        link: "/operator/transfer",
      },
    ],
  },
  {
    id: 2,
    label: "پزشکان",
    icon: (
      <div className="relative text-xl w-5 h-5">
        <MdPersonOutline />
        <div className="text-xs absolute -right-1 top-0 block">
          <RiStethoscopeLine />
        </div>
      </div>
    ),
    value: "doctor",
    child: [
      { id: 0, label: "پزشکان", value: "add", link: "/operator/doctor" },
      // {
      //   id: 1,
      //   label: "تقویم نوبت های پزشک",
      //   value: "add",
      //   link: "#",
      // },
    ],
  },
  {
    id: 3,
    label: "امکانات",
    icon: <MdFormatListBulleted />,
    value: "",
    child: [
      // {
      //   id: 0,
      //   label: "یادآوری های امروز",
      //   value: "add",
      //   link: "#",
      // },
      {
        id: 0,
        label: "لیست شماره تلفن ها",
        value: "add",
        link: "/operator/phone-numbers",
      },
    ],
  },
  {
    id: 4,
    label: "پاراکلینیک",
    icon: <RiHospitalLine />,
    value: "clinic",
    child: [
      {
        id: 0,
        label: "پاراکلینیک ها",
        value: "add",
        link: "/operator/paraclinic",
      },
    ],
  },
  {
    id: 6,
    label: "گزارشات",
    icon: <MdOutlinePoll />,
    value: "",
    child: [
      {
        id: 0,
        label: "گزارشات",
        value: "add",
        link: "/operator/report",
      },
    ],
  },
  {
    id: 12,
    label: "پیام رسان بله",
    icon: 'bale',
    value: "",

    child: [
      {
        id: 0,
        label: "گفتگو ها",
        value: "add",
        link: "/operator/bale/conversation",
      },
    ],
  },
  {
    id: 5,
    label: "مدیریت پیامک ها ",
    icon: <MdOutlineMarkunread />,
    value: "",
    child: [
      {
        id: 1,
        label: "گفت و گو ها",
        value: "add",
        link: "/operator/message/conversation",
      },
      {
        id: 0,
        label: "ارسال پیامک ",
        value: "add",
        link: "/operator/message",
      },
    ],
  },
  {
    id: 10,
    label: "پروفایل کاربری",
    icon: <MdPersonOutline />,
    value: "",
    child: [
      // {
      //   id: 0,
      //   label: "نمایش پروفایل",
      //   value: "add",
      //   link: "",
      // },
      {
        id: 0,
        label: "تغییر رمز عبور",
        value: "add",
        link: "/operator/user/change-password",
      },
      // {
      //   id: 0,
      //   label: "شکایات-انتقادات-پیشنهادات",
      //   value: "add",
      //   link: "",
      // },
    ],
  },
  {
    id: 9,
    label: "اطلاعات پایه",
    icon: <MdListAlt />,
    value: "doctor",
    child: [
      { id: 0, label: "خدمات", value: "add", link: "/operator/service" },
      { id: 1, label: "مطب ها", value: "add", link: "/operator/clinic" },
      // {
      //   id: 2,
      //   label: "برند ایمپلنت",
      //   value: "add",
      //   link: "/admin/implant",
      // },
      {
        id: 3,
        label: "وضعیت های بیمار",
        value: "add",
        link: "/operator/patient-status",
      },
      {
        id: 4,
        label: " بیماری های سیستمیک",
        value: "add",
        link: "/operator/diseases",
      },
    ],
  },
];
export const ClinicAccess = [
  {
    id: 0,
    label: "داشبورد",
    icon: <RiDashboardLine />,
    value: "doctor",
    link: "/clinic",
    child: [],
  },
  {
    id: 1,
    label: "بیماران",
    icon: <MdOutlineGroup />,
    value: "",
    child: [
      {
        id: 0,
        label: "تشکیل پرونده",
        value: "add",
        link: "/clinic/record/add",
      },
      { id: 1, label: "پرونده بیماران", value: "add", link: "/clinic/record" },
      {
        id: 2,
        label: "نوبت دهی ",
        value: "add",
        link: "/clinic/appointment",
      },
      {
        id: 3,
        label: "ثبت نوبت دهی ویژه",
        value: "add",
        link: "/clinic/vip-appointment",
      },
      {
        id: 4,
        label: "درمان های ثبت نشده",
        value: "add",

        link: "/clinic/record/unregistered-treatments",
      },
    ],
  },
  {
    id: 2,
    label: "پزشکان",
    icon: (
      <div className="relative text-xl w-5 h-5">
        <MdPersonOutline />
        <div className="text-xs absolute -right-1 top-0 block">
          <RiStethoscopeLine />
        </div>
      </div>
    ),
    value: "doctor",
    child: [{ id: 0, label: "پزشکان", value: "add", link: "/clinic/doctor" }],
  },
  // {
  //   id: 3,
  //   label: "امکانات",
  //   icon: <MdFormatListBulleted />,
  //   value: "",
  //   child: [
  //     {
  //       id: 0,
  //       label: "یادآوری های امروز",
  //       value: "add",
  //       link: "#",
  //     },
  //     {
  //       id: 0,
  //       label: "لیست شماره تلفن",
  //       value: "add",
  //       link: "/clinic/phone-numbers",
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   label: "حسابداری",
  //   icon: <BsCurrencyDollar />,
  //   value: "",
  //   child: [
  //     {
  //       id: 0,
  //       label: "مدیریت چک ها",
  //       value: "add",
  //       link: "/clinic/finance/checks",
  //     },
  //     {
  //       id: 1,
  //       label: "عودت ها",
  //       value: "add",
  //       link: "/clinic/finance/rollback",
  //     },
  //     {
  //       id: 2,
  //       label: "گزارشات مالی مطب",
  //       value: "add",
  //       link: "/clinic/finance",
  //     },
  //   ],
  // },
  {
    id: 5,
    label: "پاراکلینیک",
    icon: <RiHospitalLine />,
    value: "clinic",
    child: [
      {
        id: 0,
        label: "پاراکلینیک ها",
        value: "add",
        link: "/clinic/paraclinic",
      },
    ],
  },
  // {
  //   id: 6,
  //   label: "گزارشات",
  //   icon: <MdOutlinePoll />,
  //   value: "",
  //   child: [],
  // },
  {
    id: 9,
    label: "اطلاعات پایه",
    icon: <MdListAlt />,
    value: "doctor",
    child: [
      { id: 0, label: "خدمات", value: "add", link: "/clinic/service" },
      {
        id: 3,
        label: "وضعیت های بیمار",
        value: "add",
        link: "/clinic/patient-status",
      },
      {
        id: 4,
        label: " بیماری های سیستمیک",
        value: "add",
        link: "/clinic/diseases",
      },
    ],
  },
  {
    id: 7,
    label: "مدیریت پیامک ها ",
    icon: <MdOutlineMarkunread />,
    value: "",
    child: [
      {
        id: 0,
        label: "ارسال پیامک ",
        value: "add",
        link: "/clinic/message",
      },
    ],
  },
  {
    id: 10,
    label: "پروفایل کاربری",
    icon: <MdPersonOutline />,
    value: "",
    child: [
      // {
      //   id: 0,
      //   label: "نمایش پروفایل",
      //   value: "add",
      //   link: "",
      // },
      {
        id: 0,
        label: "تغییر رمز عبور",
        value: "add",
        link: "/clinic/user/change-password",
      },
      // {
      //   id: 0,
      //   label: "شکایات-انتقادات-پیشنهادات",
      //   value: "add",
      //   link: "",
      // },
    ],
  },
];
export const AccountingAccess = [
  {
    id: 0,
    label: "داشبورد",
    icon: <RiDashboardLine />,
    value: "doctor",
    link: "/accounting",
    child: [],
  },
  {
    id: 1,
    label: "بیماران",
    icon: <MdOutlineGroup />,
    value: "",
    child: [
      {
        id: 1,
        label: "پرونده بیماران",
        value: "add",
        link: "/accounting/record",
      },
    ],
  },

  {
    id: 4,
    label: "حسابداری",
    icon: <BsCurrencyDollar />,
    value: "",
    child: [
      {
        id: 0,
        label: "مدیریت چک ها",
        value: "add",
        link: "/accounting/finance/checks",
      },
      {
        id: 1,
        label: "عودت ها",
        value: "add",
        link: "/accounting/finance/rollback",
      },
      {
        id: 2,
        label: "گزارشات مالی مطب",
        value: "add",
        link: "/accounting/finance",
      },
      {
        id: 4,
        label: "چک های داخلی",
        value: "add",
        link: "/accounting/finance/internal-checks",
      },
    ],
  },

  {
    id: 10,
    label: "پروفایل کاربری",
    icon: <MdPersonOutline />,
    value: "",
    child: [
      {
        id: 0,
        label: "تغییر رمز عبور",
        value: "add",
        link: "/accounting/user/change-password",
      },
    ],
  },
];
export const DoctorAccess = [
  {
    id: 0,
    label: "داشبورد",
    icon: <RiDashboardLine />,
    value: "doctor",
    link: "/doctor",
    child: [],
  },
  {
    id: 1,
    label: "بیماران",
    icon: <MdOutlineGroup />,
    value: "",
    child: [
      // {
      //   id: 0,
      //   label: "تشکیل پرونده",
      //   value: "add",
      //   link: "/clinic/record/add",
      // },
      { id: 0, label: "پرونده بیماران", value: "add", link: "/doctor/record" },
      // {
      //   id: 2,
      //   label: "نوبت دهی ",
      //   value: "add",
      //   link: "/clinic/appointment",
      // },
      // {
      //   id: 3,
      //   label: "ثبت نوبت دهی ویژه",
      //   value: "add",
      //   link: "/clinic/vip-appointment",
      // },
      // {
      //   id: 4,
      //   label: "درمان های ثبت نشده",
      //   value: "add",

      //   link: "/clinic/record/unregistered-treatments",
      // },
    ],
  },
  // {
  //   id: 2,
  //   label: "پزشکان",
  //   icon: (
  //     <div className="relative text-xl w-5 h-5">
  //       <MdPersonOutline />
  //       <div className="text-xs absolute -right-1 top-0 block">
  //         <RiStethoscopeLine />
  //       </div>
  //     </div>
  //   ),
  //   value: "doctor",
  //   child: [{ id: 0, label: "پزشکان", value: "add", link: "/clinic/doctor" }],
  // },
  // {
  //   id: 3,
  //   label: "امکانات",
  //   icon: <MdFormatListBulleted />,
  //   value: "",
  //   child: [
  //     {
  //       id: 0,
  //       label: "یادآوری های امروز",
  //       value: "add",
  //       link: "#",
  //     },
  //     {
  //       id: 0,
  //       label: "لیست شماره تلفن",
  //       value: "add",
  //       link: "/clinic/phone-numbers",
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   label: "حسابداری",
  //   icon: <BsCurrencyDollar />,
  //   value: "",
  //   child: [
  //     {
  //       id: 0,
  //       label: "مدیریت چک ها",
  //       value: "add",
  //       link: "/clinic/finance/checks",
  //     },
  //     {
  //       id: 1,
  //       label: "عودت ها",
  //       value: "add",
  //       link: "/clinic/finance/rollback",
  //     },
  //     {
  //       id: 2,
  //       label: "گزارشات مالی مطب",
  //       value: "add",
  //       link: "/clinic/finance",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   label: "پاراکلینیک",
  //   icon: <RiHospitalLine />,
  //   value: "clinic",
  //   child: [
  //     {
  //       id: 0,
  //       label: "پاراکلینیک ها",
  //       value: "add",
  //       link: "/clinic/paraclinic",
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   label: "گزارشات",
  //   icon: <MdOutlinePoll />,
  //   value: "",
  //   child: [],
  // },
  // {
  //   id: 9,
  //   label: "اطلاعات پایه",
  //   icon: <MdListAlt />,
  //   value: "doctor",
  //   child: [
  //     { id: 0, label: "خدمات", value: "add", link: "/clinic/service" },
  //     {
  //       id: 3,
  //       label: "وضعیت های بیمار",
  //       value: "add",
  //       link: "/clinic/patient-status",
  //     },
  //     {
  //       id: 4,
  //       label: " بیماری های سیستمیک",
  //       value: "add",
  //       link: "/clinic/diseases",
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   label: "مدیریت پیامک ها ",
  //   icon: <MdOutlineMarkunread />,
  //   value: "",
  //   child: [
  //     {
  //       id: 0,
  //       label: "ارسال پیامک ",
  //       value: "add",
  //       link: "/clinic/message",
  //     },
  //   ],
  // },
  {
    id: 10,
    label: "پروفایل کاربری",
    icon: <MdPersonOutline />,
    value: "",
    child: [
      // {
      //   id: 0,
      //   label: "نمایش پروفایل",
      //   value: "add",
      //   link: "",
      // },
      {
        id: 0,
        label: "تغییر رمز عبور",
        value: "add",
        link: "/doctor/user/change-password",
      },
      // {
      //   id: 0,
      //   label: "شکایات-انتقادات-پیشنهادات",
      //   value: "add",
      //   link: "",
      // },
    ],
  },
];
