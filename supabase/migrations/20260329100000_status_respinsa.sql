-- Redenumește statusul 'anulată' în 'respinsă'
UPDATE rezervari SET status = 'respinsă' WHERE status = 'anulată';
