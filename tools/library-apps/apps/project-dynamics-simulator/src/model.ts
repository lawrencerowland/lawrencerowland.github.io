export const initialProjectState = {
  progress: 0, velocity: 10, quality: 70, morale: 80,
  technicalDebt: 0, teamCapability: 1, scope: 100,
};
export const initialEffects = {
  technicalDebt: true, teamLearning: true, userFeedback: true,
  weeklyMeetings: true, monthlyReviews: true, unexpectedEvents: true,
};

// Illustrative weekly rules, not fitted to observed projects. Inject random for reproducible checks.
export function advanceProjectWeek(projectState, showEffects, week, random = Math.random) {
    if (projectState.progress >= projectState.scope) return { state: projectState, events: [] };
    // Make a copy of current state
    const newState = {...projectState};
    const newEvents = [];
    
    // Apply base progress
    const baseProgress = newState.velocity * newState.teamCapability;
    let actualProgress = baseProgress;
    
    // 1. Technical Debt effect (accumulating drag)
    if (showEffects.technicalDebt) {
      const debtIncrease = random() * 2;
      newState.technicalDebt += debtIncrease;
      
      // Technical debt slows down progress
      const debtEffect = 1 - (newState.technicalDebt / 100);
      actualProgress *= Math.max(0.5, debtEffect);
      
      if (newState.technicalDebt > 30 && random() < 0.3) {
        newEvents.push({ 
          week: week, 
          event: "Technical debt is slowing down development", 
          type: "warning" 
        });
      }
    }
    
    // 2. Team Learning effect (learning effect)
    if (showEffects.teamLearning) {
      // Team gradually becomes more capable
      newState.teamCapability += 0.01;
      
      // Every few weeks, make a notable improvement
      if (week % 5 === 0 && random() < 0.7) {
        const learningBoost = 0.05 + (random() * 0.1);
        newState.teamCapability += learningBoost;
        newEvents.push({ 
          week: week, 
          event: "Team found a more efficient way to work!", 
          type: "success" 
        });
      }
    }
    
    // 3. Weekly review (regular cycle)
    if (showEffects.weeklyMeetings && week % 1 === 0) {
      // Weekly meetings slightly reduce velocity but can improve quality
      actualProgress *= 0.95;
      newState.quality += random() * 2;
      
      if (week % 4 === 0) {
        newEvents.push({ 
          week: week, 
          event: "Weekly planning session held", 
          type: "info" 
        });
      }
    }
    
    // 4. Monthly review (regular cycle with bigger impact)
    if (showEffects.monthlyReviews && week % 4 === 0) {
      // Monthly reviews take time but can address technical debt
      actualProgress *= 0.8;
      const debtReduction = 5 + (random() * 5);
      newState.technicalDebt = Math.max(0, newState.technicalDebt - debtReduction);
      
      newEvents.push({ 
        week: week, 
        event: "Monthly review: reduced technical debt", 
        type: "info" 
      });
      
      // Occasionally discover scope changes during reviews
      if (random() < 0.3) {
        const scopeChange = 5 + Math.floor(random() * 10);
        newState.scope += scopeChange;
        newEvents.push({ 
          week: week, 
          event: `Scope increased by ${scopeChange} scope points after stakeholder review`, 
          type: "warning" 
        });
      }
    }
    
    // 5. User Feedback (can be positive or accumulating drag)
    if (showEffects.userFeedback && week % 3 === 0 && newState.progress > 20) {
      const feedbackQuality = (newState.quality / 100) - 0.3 + (random() * 0.3);
      
      if (feedbackQuality > 0.5) {
        // Positive feedback boosts morale and velocity
        newState.morale += 5;
        newState.velocity += 1;
        if (random() < 0.5) {
          newEvents.push({ 
            week: week, 
            event: "Positive user feedback boosted team morale", 
            type: "success" 
          });
        }
      } else {
        // Negative feedback hurts morale and may increase scope (rework)
        newState.morale = Math.max(40, newState.morale - 5);
        if (random() < 0.5) {
          const rework = Math.floor(random() * 5);
          newState.progress = Math.max(0, newState.progress - rework);
          newEvents.push({ 
            week: week, 
            event: "Negative user feedback requires rework", 
            type: "danger" 
          });
        }
      }
    }
    
    // 6. Unexpected events (random elements)
    if (showEffects.unexpectedEvents && random() < 0.15) {
      const eventType = random();
      
      if (eventType < 0.4) {
        // Negative event
        const impact = 5 + Math.floor(random() * 10);
        newState.velocity = Math.max(5, newState.velocity - 2);
        newState.progress = Math.max(0, newState.progress - impact);
        
        const events = [
          "Team member unexpectedly absent for the week",
          "Critical bug discovered in production",
          "External dependency updated with breaking changes",
          "Infrastructure outage delayed testing"
        ];
        
        newEvents.push({ 
          week: week, 
          event: events[Math.floor(random() * events.length)], 
          type: "danger" 
        });
      } else if (eventType < 0.7) {
        // Neutral event that might have future consequences
        const events = [
          "New team member onboarding begins",
          "Management considering reorganization",
          "Competitor released similar feature",
          "Stakeholders requesting progress report"
        ];
        
        newEvents.push({ 
          week: week, 
          event: events[Math.floor(random() * events.length)], 
          type: "warning" 
        });
      } else {
        // Positive unexpected event
        newState.velocity += 2;
        newState.morale = Math.min(100, newState.morale + 5);
        
        const events = [
          "Team innovation solved multiple problems at once",
          "New tool dramatically improved workflow",
          "Unexpected solution simplifies implementation",
          "External dependency update brings helpful features"
        ];
        
        newEvents.push({ 
          week: week, 
          event: events[Math.floor(random() * events.length)], 
          type: "success" 
        });
      }
    }
    
    // Bound the percentage before it scales next week's velocity.
    newState.morale = Math.max(0, Math.min(100, newState.morale));
    // Apply morale effects on velocity
    const moraleEffect = 0.5 + (newState.morale / 200); // 0.5 to 1
    newState.velocity = Math.max(5, newState.velocity * moraleEffect);
    
    // Update progress
    newState.progress += actualProgress;
    
    // Check for project completion
    if (newState.progress >= newState.scope) {
      newState.progress = newState.scope;
      newEvents.push({ 
        week: week, 
        event: "Project completed!", 
        type: "success" 
      });

    }
    
    // Keep internal precision: rounding each week previously erased +0.01 learning.
    newState.quality = Math.max(0, Math.min(100, newState.quality));
    newState.morale = Math.max(0, Math.min(100, newState.morale));
    return { state: newState, events: newEvents };
}
