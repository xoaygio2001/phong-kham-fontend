export const adminMenu = [
    { //hệ thống
        name: 'menu.admin.manage-user',
        menus: [
            // {
            //     name: 'menu.admin.crud',
            //     link: '/system/user-manage'
            // },
            {
                name: 'menu.admin.crud-redux',
                link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor',
                link: '/system/manage-doctor'
            },

            {// Quản lý kế hoạch khám bệnh của bác sỹ
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/manage-schedule'
            },
            // { name: 'menu.system.system-parameter.header', link: '/system/system-parameter' },
        ]
    },


    {   //  Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic',
                link: '/system/manage-clinic'
            }
        ]

    },

    {   //  Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty',
                link: '/system/manage-specialty'
            }
        ]

    },

    {   //  Quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook',
                link: '/system/manage-handbook'
            }
        ]

    },

    {   //  Quản lý bình luận
        name: 'Bình luận',
        menus: [
            {
                name: 'Quản lý bình luận',
                link: '/system/manage-comment'
            }
        ]

    },
];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            { // Quản lý kế hoạch khám bệnh của bác sĩ
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient'
            }
        ]
    }
]