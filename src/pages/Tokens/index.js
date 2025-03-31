import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { tokenService } from '../../services/api/tokenService';
import TokenList from './components/TokenList';
import BuyTokenForm from './components/BuyTokenForm';
import TokenHistory from './components/TokenHistory';

const Tokens = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await tokenService.getTokens();
      dispatch({ type: 'SET_TOKENS', payload: response.data });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to fetch tokens' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Meal Tokens
          </h2>
          
          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['available', 'buy', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'available' && (
              <TokenList tokens={state.tokens} />
            )}
            {activeTab === 'buy' && (
              <BuyTokenForm onSuccess={fetchTokens} />
            )}
            {activeTab === 'history' && (
              <TokenHistory />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokens; 