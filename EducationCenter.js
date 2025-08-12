import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaClock, 
  FaGraduationCap,
  FaLightbulb,
  FaRecycle,
  FaLeaf,
  FaAward
} from 'react-icons/fa';
import { 
  educationTips, 
  wasteCategories, 
  recyclingBenefits, 
  funFacts 
} from '../../data/educationData';
import './EducationCenter.css';

const EducationCenter = () => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTips = selectedCategory === 'all' 
    ? educationTips 
    : educationTips.filter(tip => tip.category === selectedCategory);

  const categories = ['all', ...new Set(educationTips.map(tip => tip.category))];

  const nextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
  };

  const prevFact = () => {
    setCurrentFactIndex((prev) => (prev - 1 + funFacts.length) % funFacts.length);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="education-center">
      <div className="education-header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="header-content"
        >
          <FaGraduationCap className="header-icon" />
          <h1>Waste Education Center</h1>
          <p>Learn how to make a positive impact through proper waste management</p>
        </motion.div>
      </div>

      {/* Waste Categories Overview */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="categories-section"
      >
        <h2>Waste Categories</h2>
        <div className="categories-grid">
          {wasteCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="category-card"
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
                <span className="bin-color" style={{ backgroundColor: category.color }}>
                  {category.binColor} Bin
                </span>
              </div>
              <div className="category-examples">
                {category.examples.map((example, idx) => (
                  <span key={idx} className="example-tag">{example}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Fun Facts Carousel */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fun-facts-section"
      >
        <h2>
          <FaLightbulb className="section-icon" />
          Did You Know?
        </h2>
        <div className="fact-carousel">
          <button onClick={prevFact} className="carousel-button prev">
            <FaChevronLeft />
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFactIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="fact-content"
            >
              <p>{funFacts[currentFactIndex]}</p>
            </motion.div>
          </AnimatePresence>
          <button onClick={nextFact} className="carousel-button next">
            <FaChevronRight />
          </button>
        </div>
        <div className="fact-indicators">
          {funFacts.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentFactIndex ? 'active' : ''}`}
              onClick={() => setCurrentFactIndex(index)}
            />
          ))}
        </div>
      </motion.section>

      {/* Recycling Benefits */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="benefits-section"
      >
        <h2>
          <FaAward className="section-icon" />
          Benefits of Recycling
        </h2>
        <div className="benefits-grid">
          {recyclingBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="benefit-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
              <div className="benefit-stat">{benefit.stats}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Educational Tips */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="tips-section"
      >
        <div className="tips-header">
          <h2>
            <FaRecycle className="section-icon" />
            Educational Tips
          </h2>
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Tips' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="tips-grid">
          {filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="tip-card"
              onClick={() => setSelectedTip(tip)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="tip-header">
                <span className="tip-icon">{tip.icon}</span>
                <div className="tip-meta">
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(tip.difficulty) }}
                  >
                    {tip.difficulty}
                  </span>
                  <span className="read-time">
                    <FaClock className="clock-icon" />
                    {tip.readTime}
                  </span>
                </div>
              </div>
              <h3>{tip.title}</h3>
              <p className="tip-description">{tip.description}</p>
              <div className="tip-category">{tip.category}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tip Modal */}
      <AnimatePresence>
        {selectedTip && (
          <TipModal 
            tip={selectedTip} 
            onClose={() => setSelectedTip(null)}
            getDifficultyColor={getDifficultyColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TipModal = ({ tip, onClose, getDifficultyColor }) => {
  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="tip-modal"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="modal-icon">{tip.icon}</span>
            <div>
              <h2>{tip.title}</h2>
              <div className="modal-meta">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(tip.difficulty) }}
                >
                  {tip.difficulty}
                </span>
                <span className="read-time">
                  <FaClock className="clock-icon" />
                  {tip.readTime}
                </span>
                <span className="category-tag">{tip.category}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="modal-content">
          <p className="modal-description">{tip.description}</p>
          
          <div className="content-section">
            <h3>What You Need to Know</h3>
            <ul className="content-list">
              {tip.content.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="tips-section-modal">
            <h3>
              <FaLeaf className="tips-icon" />
              Pro Tips
            </h3>
            <div className="pro-tips">
              {tip.tips.map((tipItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="pro-tip"
                >
                  <FaLightbulb className="tip-bullet" />
                  <span>{tipItem}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EducationCenter; 