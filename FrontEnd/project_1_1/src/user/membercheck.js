import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MemberList = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
   
    axios.get('http://localhost:3001/api/members')
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error('Error fetching members:', error);
      });
  }, []);

  return (
    <div>
      <h2>Member List</h2>
      <ul>
        {members.map(member => (
          <li key={member.MEMBER_ID}>
            {member.USERNAME} - {member.EMAIL}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
