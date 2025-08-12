import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, actionTypes } from '../../contexts/AppContext';
import { 
  rewardActions, 
  vouchers, 
  achievements, 
  leaderboard 
} from '../../data/rewardsData';
import { 
  FaGift, 
  FaQrcode, 
  FaTrophy, 
  FaCrown, 
  FaCoins,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { format } from 'date-fns';
import './RewardsCenter.css';

const RewardsCenter = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('earn');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleEarnPoints = (action) => {
    dispatch({
      type: actionTypes.ADD_POINTS,
      payload: action.points
    });
    
    // Show success animation or notification
    alert(`Earned ${action.points} points for ${action.name}!`);
  };

  const handleRedeemVoucher = async (voucher) => {
    if (state.user.points < voucher.points) {
      alert('Insufficient points!');
      return;
    }

    setIsRedeeming(true);
    
    // Simulate redemption process
    setTimeout(() => {
      const redemption = {
        id: `redemption-${Date.now()}`,
        voucherId: voucher.id,
        voucherTitle: voucher.title,
        points: voucher.points,
        value: voucher.value,
        redeemedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      dispatch({
        type: actionTypes.REDEEM_POINTS,
        payload: redemption
      });

      setIsRedeeming(false);
      setSelectedVoucher(null);
      alert(`Successfully redeemed ${voucher.title}!`);
    }, 2000);
  };

  const tabs = [
    { id: 'earn', label: 'Earn Points', icon: <FaCoins /> },
    { id: 'redeem', label: 'Redeem Vouchers', icon: <FaGift /> },
    { id: 'achievements', label: 'Achievements', icon: <FaTrophy /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <FaCrown /> }
  ];

  return (
    <div className="rewards-center">
      <div className="rewards-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <FaGift className="header-icon" />
          <h1>Rewards Center</h1>
          <p>Earn points for eco-friendly actions and redeem amazing rewards</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="points-display"
        >
          <div className="points-card">
            <FaCoins className="points-icon" />
            <div className="points-info">
              <h2>{state.user.points}</h2>
              <p>Available Points</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          <AnimatePresence mode="wait">
            {activeTab === 'earn' && (
              <EarnPointsTab 
                actions={rewardActions} 
                onEarnPoints={handleEarnPoints} 
              />
            )}
            {activeTab === 'redeem' && (
              <RedeemVouchersTab 
                vouchers={vouchers}
                userPoints={state.user.points}
                onSelectVoucher={setSelectedVoucher}
                redemptions={state.redemptions}
              />
            )}
            {activeTab === 'achievements' && (
              <AchievementsTab achievements={achievements} />
            )}
            {activeTab === 'leaderboard' && (
              <LeaderboardTab leaderboard={leaderboard} currentUser={state.user} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Voucher Redemption Modal */}
      <AnimatePresence>
        {selectedVoucher && (
          <VoucherModal
            voucher={selectedVoucher}
            userPoints={state.user.points}
            isRedeeming={isRedeeming}
            onRedeem={handleRedeemVoucher}
            onClose={() => setSelectedVoucher(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const EarnPointsTab = ({ actions, onEarnPoints }) => {
  return (
    <motion.div
      key="earn"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="earn-points-tab"
    >
      <h2>Earn Points</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="action-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="action-icon">{action.icon}</div>
            <h3>{action.name}</h3>
            <p>{action.description}</p>
            <div className="action-footer">
              <span className="points">+{action.points} pts</span>
              <button 
                className="earn-button"
                onClick={() => onEarnPoints(action)}
              >
                {action.id === 'scan-recycle' ? <FaQrcode /> : <FaCheck />}
                Earn Points
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const RedeemVouchersTab = ({ vouchers, userPoints, onSelectVoucher, redemptions }) => {
  const categories = [...new Set(vouchers.map(v => v.category))];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredVouchers = selectedCategory === 'all' 
    ? vouchers 
    : vouchers.filter(v => v.category === selectedCategory);

  return (
    <motion.div
      key="redeem"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="redeem-vouchers-tab"
    >
      <div className="redeem-header">
        <h2>Redeem Vouchers</h2>
        <div className="category-filter">
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="vouchers-grid">
        {filteredVouchers.map((voucher, index) => (
          <motion.div
            key={voucher.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`voucher-card ${userPoints < voucher.points ? 'insufficient' : ''}`}
            onClick={() => onSelectVoucher(voucher)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="voucher-header">
              <span className="voucher-icon">{voucher.icon}</span>
              <span className="voucher-value">{voucher.value}</span>
            </div>
            <h3>{voucher.title}</h3>
            <p>{voucher.description}</p>
            <div className="voucher-footer">
              <span className="partner">{voucher.partner}</span>
              <div className="points-required">
                <FaCoins />
                {voucher.points}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {redemptions.length > 0 && (
        <div className="redemption-history">
          <h3>Recent Redemptions</h3>
          <div className="history-list">
            {redemptions.slice(-3).map(redemption => (
              <div key={redemption.id} className="history-item">
                <span>{redemption.voucherTitle}</span>
                <span className="date">
                  {format(new Date(redemption.redeemedAt), 'MMM dd, yyyy')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const AchievementsTab = ({ achievements }) => {
  return (
    <motion.div
      key="achievements"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="achievements-tab"
    >
      <h2>Achievements</h2>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            {achievement.unlocked ? (
              <div className="achievement-status unlocked">
                <FaCheck />
                <span>Unlocked</span>
              </div>
            ) : (
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(achievement.progress / achievement.target) * 100}%` 
                    }}
                  />
                </div>
                <span>{achievement.progress}/{achievement.target}</span>
              </div>
            )}
            <div className="achievement-points">+{achievement.points} pts</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const LeaderboardTab = ({ leaderboard, currentUser }) => {
  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="leaderboard-tab"
    >
      <h2>Leaderboard</h2>
      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`leaderboard-item ${entry.name === 'You' ? 'current-user' : ''}`}
          >
            <div className="rank">
              {entry.rank <= 3 ? (
                <span className={`medal medal-${entry.rank}`}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="rank-number">#{entry.rank}</span>
              )}
            </div>
            <div className="user-info">
              <span className="avatar">{entry.avatar}</span>
              <span className="name">{entry.name}</span>
            </div>
            <div className="points">{entry.points} pts</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const VoucherModal = ({ voucher, userPoints, isRedeeming, onRedeem, onClose }) => {
  const canRedeem = userPoints >= voucher.points;

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="voucher-modal"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="voucher-info">
            <span className="voucher-icon-large">{voucher.icon}</span>
            <div>
              <h2>{voucher.title}</h2>
              <p className="partner">{voucher.partner}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="voucher-details">
            <div className="detail-row">
              <span>Value:</span>
              <span className="value">{voucher.value}</span>
            </div>
            <div className="detail-row">
              <span>Points Required:</span>
              <span className="points">{voucher.points} pts</span>
            </div>
            <div className="detail-row">
              <span>Valid For:</span>
              <span>{voucher.validFor}</span>
            </div>
            <div className="detail-row">
              <span>Category:</span>
              <span>{voucher.category}</span>
            </div>
          </div>

          <div className="voucher-description">
            <h3>Description</h3>
            <p>{voucher.description}</p>
          </div>

          <div className="voucher-terms">
            <h3>Terms & Conditions</h3>
            <p>{voucher.terms}</p>
          </div>
        </div>

        <div className="modal-footer">
          {!canRedeem ? (
            <div className="insufficient-points">
              <span>Need {voucher.points - userPoints} more points</span>
            </div>
          ) : (
            <button 
              className="redeem-button"
              onClick={() => onRedeem(voucher)}
              disabled={isRedeeming}
            >
              {isRedeeming ? (
                <>
                  <FaSpinner className="spinner" />
                  Redeeming...
                </>
              ) : (
                <>
                  <FaGift />
                  Redeem for {voucher.points} points
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RewardsCenter; 