import { useState } from 'react';
import ButtonField from '../../../../Components/ButtonField/ButtonField';
import '../../../GroupList/GroupList.scss';
import './TripList.scss';
import { PlanTrip } from '../../PlanTrip/Main/PlanTrip';
import { useNavigate } from 'react-router-dom';
export const TripList = () => {
    const navigate = useNavigate();
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
                    text={'Plan trip'} 
                    onClick={()=>navigate('plan-trip')} 
                    className='blue_button'/>
            </div>
            <main>            
                <div className="group">
                    <div className='groupdata'>
                        <h3>Trip name</h3>
                        <p>Trip name</p>
                        <h3>Planned by</h3>
                        <p>Planned by</p>
                    </div>
                </div>
            </main>
        </div>
    );
}