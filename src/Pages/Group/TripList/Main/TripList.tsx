import { useState } from 'react';
import ButtonField from '../../../../Components/ButtonField/ButtonField';
import '../../../GroupList/GroupList.scss';
import './TripList.scss';
import { PlanTrip } from '../../PlanTrip/Main/PlanTrip';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorPage } from '../../../../Components/ErrorPage/ErrorPage';
import { DataNotFound } from '../../../../Components/DataNotFound/DataNotFound';
export const TripList = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const group_id = location?.state?.group_id;
    const admin_id = location?.state?.admin_id;

    return (
        <div className="grouplist-container triplist-container">
            <div className="triplist-header">
                <div>
                    <p>Filter trips</p>
                    <select name="" id="">
                        <option value="">All</option>
                        <option value="">Completed</option>
                        <option value="">Upcoming</option>
                    </select>
                </div>
                <ButtonField type={'button'} 
                    text={'Plan Trip'} 
                    className={'blue_button'}
                    onClick={()=> navigate('/group/plan-trip', 
                        { 
                            state: { 
                                group_id: group_id, 
                                admin_id: admin_id
                            }
                        }
                        )}/>
            </div>
            <main>            
                {/* <div className="group">
                    <div className='groupdata'>
                        <h3>Trip name</h3>
                        <p>Trip name</p>
                        <h3>Planned by</h3>
                        <p>Planned by</p>
                    </div>
                </div> */}
                <DataNotFound message={"Trips"}/>
            </main>
        </div>
    );
}