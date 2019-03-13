import React from 'react';

const Loading = () => 
    <div className="text-center alert alert-success py-4 text-success m-2">
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
        <br />
        <h3 className="text-success">Loading...</h3>
    </div>

export default Loading;