// Debug script to help diagnose issues with the clock matching game
console.log('Debug script loaded');

window.addEventListener('load', function() {
    console.log('Window loaded');
    
    // Check if elements exist
    const elements = [
        'start-game',
        'reset-game',
        'play-again',
        'pairs-count',
        'game-board',
        'moves',
        'time',
        'final-time',
        'final-moves',
        'win-message'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element ${id} exists: ${element !== null}`);
        
        if (element) {
            // Add a click handler to all buttons to verify they're clickable
            if (element.tagName === 'BUTTON') {
                element.addEventListener('click', function() {
                    console.log(`Button ${id} clicked`);
                });
            }
        }
    });
    
    // Force hide the win message
    const winMessage = document.getElementById('win-message');
    if (winMessage) {
        winMessage.style.display = 'none';
        winMessage.style.pointerEvents = 'none';
        winMessage.classList.add('hidden');
        console.log('Win message hidden');
    }
    
    // Add a global click handler to check if clicks are being registered
    document.addEventListener('click', function(e) {
        console.log(`Click detected at (${e.clientX}, ${e.clientY})`);
        console.log(`Target element: ${e.target.tagName} ${e.target.id ? '#' + e.target.id : ''}`);
    });
    
    // Check for any elements that might be blocking clicks
    const bodyChildren = document.body.children;
    for (let i = 0; i < bodyChildren.length; i++) {
        const child = bodyChildren[i];
        const styles = window.getComputedStyle(child);
        if (styles.position === 'fixed' || styles.position === 'absolute') {
            console.log(`Potential blocking element: ${child.tagName} ${child.id ? '#' + child.id : ''}`);
            console.log(`  Position: ${styles.position}`);
            console.log(`  Z-index: ${styles.zIndex}`);
            console.log(`  Display: ${styles.display}`);
            console.log(`  Visibility: ${styles.visibility}`);
            console.log(`  Pointer-events: ${styles.pointerEvents}`);
        }
    }
}); 