import ButtonField from '../../../Components/ButtonField/ButtonField';
import '../../GroupList/GroupList.scss';
import './TripList.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataNotFound } from '../../../Components/DataNotFound/DataNotFound';
import { useMutation, useQuery } from '@apollo/client';
import { JoinedTrips } from '../../../ApolloClient/Queries/Trips';
import { Loader } from '../../../Components/Loader/Loader';
import { ErrorPage } from '../../../Components/ErrorPage/ErrorPage';
import { GroupMemberDetails } from '../../../ApolloClient/Queries/Groups';
import { makeToast } from '../../../Components/Toast/makeToast';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { DeleteTrip } from '../../../ApolloClient/Mutation/Trips';
import { Confirmation } from '../../../Components/Confirmation/Confirmation';
import { Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';

interface Trip_Props {
    trip_id: string
    trip_name: string
    trip_description: string
    trip_status: string
    trip_days_count: string
    trip_start_date: string
    created_by: {
        member_id: string
        user: {
            name: string
            email: string
        }
    }
    trip_members: {
        trip_member_id: string
        group_member: {
            member_id: string
            user: {
                name: string
                email: string
            }
        }
    }
    trip_checklists: string[]
    trip_activities: {
        activity: string
        budget: string
    }
}
export enum TripList_Filter {
    ALL = "all",
    PLANNED = "planned",
    CANCELED = "canceled",
    COMPLETED = "completed"
}
export const getTripStatusColor = (status: string) => {
    switch (status) {
        case TripList_Filter.PLANNED:
            return "--color-green";
        case TripList_Filter.CANCELED:
            return "--color-red";
        case TripList_Filter.COMPLETED:
            return "--color-blue";
    }
}
export const TripList = () => {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    const [menuOpenState, setMenuOpenState] = useState<boolean>(false);
    const [filtertype, setFilterType] = useState<TripList_Filter>(TripList_Filter.ALL);
    const [selectedTrip, setSelectedTrip] = useState({ trip_id: "", trip_name: "" });
    const [deleteTripConfirm, setDeleteTripConfirm] = useState<boolean>(false);
    const [deleteTrip] = useMutation(DeleteTrip);


    useEffect(() => {
        refetchJoinedTrips();
    }, [filtertype]);


    const { data: userInGroup } = useQuery(GroupMemberDetails,
        {
            variables: {
                input: {
                    group_id: user?.group_id
                }
            },
            skip: !user?.group_id,
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        },
    );


    const { data: tripdata, loading, error, refetch: refetchJoinedTrips } = useQuery(JoinedTrips,
        {
            variables: {
                input: {
                    member_id: user?.current_group_member_id,
                    filter_type: filtertype
                }
            }
        })

    const deleteTripProcess = async () => {
        setDeleteTripConfirm(false);
        await deleteTrip({
            variables: {
                input: {
                    trip_id: selectedTrip?.trip_id,
                    group_member_id: user?.current_group_member_id
                }
            },
            onCompleted: (data) => {
                makeToast({ message: data?.deleteTrip, toastType: "success" });
                refetchJoinedTrips();
            },
            onError: (err) => {
                makeToast({ message: err?.message, toastType: "error" });
            }
        })
    }
    const handleFilterSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterType(event.target.value as TripList_Filter);
    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
    const handleMenu = (event: React.MouseEvent<HTMLElement>, trip: Trip_Props) => {
        setSelectedTrip(
            {
                trip_id: trip?.trip_id, 
                trip_name: trip?.trip_name
            }
        )
        event.stopPropagation();
        setAnchorEl(event?.currentTarget);
        setMenuOpenState(true);
    }
    const closeMenu=()=>{
        setMenuOpenState(false);
    }
    if (loading) {
        return <Loader />;
    } else if (error) {
        return <ErrorPage />;
    }
    return (
        <div className="grouplist-container triplist-container">
            <div className="triplist-header">
                <div>
                    <p>Filter trips</p>
                    <select onChange={handleFilterSelect}>
                        <option value={TripList_Filter.ALL}>All</option>
                        <option value={TripList_Filter.PLANNED}>Planned</option>
                        <option value={TripList_Filter.COMPLETED}>Completed</option>
                        <option value={TripList_Filter.CANCELED}>Canceled</option>
                    </select>
                </div>
                {
                    userInGroup?.groupMember?.user_role === 'admin'
                    &&
                    <ButtonField type={'button'}
                        text={'Plan Trip'}
                        className={'blue_button'}
                        onClick={() => navigate('/group/plan-trip',
                            {
                                state: {
                                    group_id: user?.group_id,
                                    member_id: user?.current_group_member_id
                                }
                            }
                        )} />
                }

            </div>
            <main>
                {tripdata?.joinedTrips?.length > 0 ?
                    tripdata?.joinedTrips?.map((trip: Trip_Props) => (
                        <div className="group" key={trip?.trip_id}
                            onClick={() => [
                                navigate('/group/trip',
                                    {
                                        state: {
                                            group_id: user?.group_id,
                                            member_id: user?.current_group_member_id,
                                            trip_id: trip?.trip_id
                                        }
                                    }
                                )
                            ]}
                        >
                            <div className='card-top'>
                                <h4 className='name'
                                    style={{ color: `var(${getTripStatusColor(trip?.trip_status)}` }}>{trip?.trip_status}</h4>
                                <span onClick={(event) =>  handleMenu(event, trip) }>
                                    <MoreVert />
                                </span>
                            </div>

                            <div className='group-data'>
                                <div>
                                    <h3 >Trip name</h3>
                                    <p className='name'>{trip?.trip_name}</p>
                                </div>
                                <div>
                                    <h3>Planned by</h3>
                                    <p>{trip?.created_by?.user?.name}</p>
                                </div>

                            </div>
                        </div>
                    )) : <DataNotFound />
                }
            </main>
            <Confirmation open={deleteTripConfirm}
                onClose={() => setDeleteTripConfirm(false)}
                title={`Do you want to delete Trip ${selectedTrip?.trip_name}`}
                confirmButtonText={'Confirm'}
                closeButtonText={'Cancel'}
                onSuccess={deleteTripProcess} />

            <Menu
                open={menuOpenState}
                onClose={() => setMenuOpenState(false)}
                anchorEl={anchorEl}>
                <MenuItem onClick={() => {
                    closeMenu();
                    navigate('/group/plan-trip',
                        {
                            state: {
                                group_id: user?.group_id,
                                member_id: user?.current_group_member_id,
                                trip_id: selectedTrip?.trip_id
                            }
                        });
                }}>Edit</MenuItem>
                <MenuItem onClick={() => {
                    closeMenu();
                    setDeleteTripConfirm(true);
                }}>Delete</MenuItem>
            </Menu>
        </div>
    );
}